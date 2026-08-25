import crypto from 'crypto';
import Razorpay from 'razorpay';

import { StatusCodes } from 'http-status-codes';

import logger from '../common/logger/logger.js';

import ApiError from '../common/errors/ApiError.js';

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (razorpayInstance) return razorpayInstance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    logger.warn('Razorpay credentials not configured. Payment features will fail.');
    return null;
  }

  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayInstance;
};

const AMOUNTS = {
  MONTHLY: 2499,
  YEARLY: 24999,
};

const DEFAULT_CURRENCY = 'INR';

class PaymentProvider {
  isConfigured() {
    return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  }

  getAmount(billingCycle) {
    if (!billingCycle) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Billing cycle is required.'
      );
    }

    const normalized = billingCycle.toUpperCase();

    if (!Object.prototype.hasOwnProperty.call(AMOUNTS, normalized)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Invalid billing cycle.'
      );
    }

    return AMOUNTS[normalized];
  }

  getCurrency() {
    return DEFAULT_CURRENCY;
  }

  getProvider() {
    return 'RAZORPAY';
  }

  toPaise(amountRupees) {
    return Math.round(amountRupees * 100);
  }

  toRupees(amountPaise) {
    return amountPaise / 100;
  }

  async createPaymentOrder({ billingCycle, subscription, tenant, planCode = 'CONTRACTOR_PRO' }) {
    const razorpay = getRazorpayInstance();

    const amount = this.getAmount(billingCycle);
    const currency = this.getCurrency();
    const amountInPaise = this.toPaise(amount);

    const receipt = `sub_${subscription}_${Date.now().toString(36)}`;

    const notes = {
      subscription_id: String(subscription),
      tenant_id: String(tenant),
      plan_code: planCode,
      billing_cycle: billingCycle.toUpperCase(),
    };

    if (!razorpay) {
      const orderId = `ORDER_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      logger.warn('Razorpay not configured. Returning test order.', {
        orderId,
        billingCycle,
        amount,
      });

      return {
        orderId,
        amount,
        amountInPaise,
        currency,
        billingCycle: billingCycle.toUpperCase(),
        provider: this.getProvider(),
        receipt,
        notes,
        testMode: true,
        checkoutUrl: '',
      };
    }

    try {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes,
        payment_capture: 1,
      });

      logger.info('Razorpay order created', {
        orderId: order.id,
        billingCycle,
        amount,
        subscription,
        tenant,
      });

      return {
        orderId: order.id,
        amount,
        amountInPaise,
        currency: order.currency,
        billingCycle: billingCycle.toUpperCase(),
        provider: this.getProvider(),
        receipt: order.receipt,
        notes,
        testMode: false,
        checkoutUrl: '',
      };
    } catch (error) {
      logger.error('Razorpay order creation failed', {
        error: error.message,
        billingCycle,
        amount,
      });

      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        'Failed to initialize payment. Please try again.'
      );
    }
  }

  verifyPaymentSignature({ providerPaymentId, providerOrderId, providerSignature }) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      logger.warn('RAZORPAY_KEY_SECRET not set. Signature verification skipped.');

      if (!providerPaymentId || !providerOrderId || !providerSignature) {
        return {
          isValid: false,
          reason: 'Missing required payment verification fields.',
        };
      }

      return {
        isValid: true,
        providerPaymentId,
        providerOrderId,
        providerSignature,
      };
    }

    if (!providerPaymentId || !providerOrderId || !providerSignature) {
      return {
        isValid: false,
        reason: 'Missing required payment verification fields.',
      };
    }

    const body = `${providerOrderId}|${providerPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === providerSignature;

    if (!isValid) {
      logger.warn('Razorpay signature verification failed', {
        orderId: providerOrderId,
      });
    }

    return {
      isValid,
      providerPaymentId,
      providerOrderId,
      providerSignature,
      reason: isValid ? null : 'Payment signature verification failed.',
    };
  }

  parseSuccessResponse({ providerPaymentId, providerOrderId, providerSignature, amount, currency }) {
    return this.verifyPaymentSignature({
      providerPaymentId,
      providerOrderId,
      providerSignature,
      amount,
      currency,
    });
  }

  verifyWebhookSignature({ payload, signature }) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      logger.warn('RAZORPAY_WEBHOOK_SECRET not set. Webhook verification skipped.');
      return true;
    }

    if (!payload || !signature) {
      return false;
    }

    const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }

  async processWebhook({ payload, signature }) {
    const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);

    const isValid = this.verifyWebhookSignature({
      payload: rawBody,
      signature,
      secret: process.env.RAZORPAY_WEBHOOK_SECRET,
    });

    if (!isValid) {
      logger.warn('Invalid Razorpay webhook signature received.');
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid webhook signature.');
    }

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid webhook payload.');
    }

    const isCaptured = event === 'payment.captured';
    const isFailed = event === 'payment.failed';

    logger.info('Razorpay webhook processed', {
      event,
      orderId: paymentEntity.order_id,
      paymentId: paymentEntity.id,
    });

    return {
      providerOrderId: paymentEntity.order_id,
      providerPaymentId: paymentEntity.id,
      providerSignature: signature || '',
      status: isCaptured ? 'COMPLETED' : isFailed ? 'FAILED' : 'PENDING',
      amount: this.toRupees(paymentEntity.amount),
      currency: paymentEntity.currency,
      paidAt: isCaptured ? new Date() : null,
      failureReason: isFailed ? (paymentEntity.error_description || 'Payment failed.') : '',
      metadata: payload,
    };
  }
}

export default new PaymentProvider();
