import { StatusCodes } from 'http-status-codes';

import mongoose from 'mongoose';

import subscriptionService from './subscription.service.js';

import notificationService from './notification.service.js';

import paymentProvider from './paymentProvider.js';

import subscriptionPaymentRepository from '../repositories/subscriptionPayment.repository.js';

import subscriptionRepository from '../repositories/subscription.repository.js';

import subscriptionPlanRepository from '../repositories/subscriptionPlan.repository.js';

import tenantRepository from '../repositories/tenant.repository.js';

import logger from '../common/logger/logger.js';

import ApiError from '../common/errors/ApiError.js';

import SUBSCRIPTION_MESSAGES from '../common/constants/subscription.messages.js';

class SubscriptionPaymentService {
  async createPaymentOrder(tenantId, billingCycle, user) {
    let subscription = await subscriptionRepository.findByTenant(tenantId);

    if (!subscription) {
      const plan = await subscriptionPlanRepository.findByCode('CONTRACTOR_PRO');

      if (!plan || plan.status !== 'ACTIVE') {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND
        );
      }

      const normalizedCycle = billingCycle?.toUpperCase() === 'YEARLY' ? 'YEARLY' : 'MONTHLY';
      const now = new Date();

      subscription = await subscriptionRepository.create({
        tenant: tenantId,
        plan: plan._id,
        status: 'TRIAL',
        billingCycle: normalizedCycle,
        startDate: null,
        endDate: null,
        trialStart: now,
        trialEndDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        autoRenew: false,
      });
    }

    const plan = await subscriptionPlanRepository.findById(subscription.plan);

    if (!plan || plan.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND
      );
    }

    const order = await paymentProvider.createPaymentOrder({
      billingCycle,
      subscription: subscription._id,
      tenant: tenantId,
      planCode: plan.code,
    });

    const payment = await subscriptionPaymentRepository.create({
      tenant: tenantId,
      subscription: subscription._id,
      provider: order.provider,
      providerOrderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      billingCycle: billingCycle.toUpperCase(),
      status: 'PENDING',
      metadata: {
        planId: subscription.plan,
        planCode: plan.code,
        userName: user?.email || null,
      },
      createdBy: user?.userId || null,
    });

    logger.info('Subscription payment order created', {
      paymentId: payment._id,
      orderId: payment.providerOrderId,
      tenantId,
      billingCycle,
      amount: payment.amount,
    });

    return payment;
  }

  async verifyPaymentAndActivateSubscription({ providerOrderId, providerPaymentId, providerSignature, billingCycle, amount, currency }) {
    const existingPayment = await subscriptionPaymentRepository.findByOrderId(providerOrderId);

    if (!existingPayment) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Payment order not found. Please create a payment order first.'
      );
    }

    if (existingPayment.status === 'COMPLETED') {
      logger.info('Duplicate payment verification attempt for completed payment', {
        paymentId: existingPayment._id,
        orderId: providerOrderId,
      });

      return existingPayment;
    }

    const verification = paymentProvider.parseSuccessResponse({
      providerPaymentId,
      providerOrderId,
      providerSignature,
      amount,
      currency,
    });

    if (!verification.isValid) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        verification.reason || 'Payment verification failed.'
      );
    }

    if (amount !== existingPayment.amount) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Payment amount mismatch.'
      );
    }

    const planCode = existingPayment.metadata?.planCode || 'CONTRACTOR_PRO';
    const plan = await subscriptionPlanRepository.findByCode(planCode);

    if (!plan) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND
      );
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const payment = await subscriptionPaymentRepository.update(
        existingPayment._id,
        {
          providerPaymentId,
          providerSignature,
          status: 'COMPLETED',
          paidAt: new Date(),
          metadata: {
            ...existingPayment.metadata,
            verifiedAt: new Date(),
          },
        },
        existingPayment.tenant,
        session
      );

      const subscription = await subscriptionRepository.findById(payment.subscription, session);

      if (!subscription) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
        );
      }

      const normalizedCycle = billingCycle?.toUpperCase() || 'MONTHLY';

      if (subscription.status === 'ACTIVE' || subscription.status === 'GRACE_PERIOD' || subscription.status === 'PAYMENT_FAILED' || subscription.status === 'EXPIRED') {
        await subscriptionService.renewSubscription(
          subscription.tenant,
          normalizedCycle,
          providerPaymentId
        );
      } else {
        const now = new Date();
        const endDate = new Date(now);

        if (normalizedCycle === 'YEARLY') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }

        await subscriptionRepository.update(
          subscription._id,
          {
            status: 'ACTIVE',
            billingCycle: normalizedCycle,
            startDate: now,
            endDate,
          },
          session
        );
      }

      await session.commitTransaction();

      try {
        const tenant = await tenantRepository.findById(subscription.tenant);
        const owner = tenant?.owner;

        if (owner) {
          await notificationService.createSubscriptionNotification(
            {
              category: 'SUBSCRIPTION',
              eventType: 'PAYMENT_SUCCESS',
              title: 'Payment Successful',
              message: `Your payment of ${amount} ${currency} was successful. Your subscription has been activated.`,
              type: 'SUCCESS',
              recipient: owner._id,
              status: 'ACTIVE',
            },
            subscription.tenant
          );
        }
      } catch (notifError) {
        logger.error('Failed to create payment success notification', {
          error: notifError.message,
          paymentId: payment._id,
          subscriptionId: subscription._id,
        });
      }

      logger.info('Subscription payment verified and subscription processed', {
        paymentId: payment._id,
        subscriptionId: subscription._id,
        orderId: providerOrderId,
        billingCycle: normalizedCycle,
        amount,
      });

      return payment;
    } catch (error) {
      await session.abortTransaction();

      logger.error('Payment verification transaction failed', {
        error: error.message,
        orderId: providerOrderId,
        stack: error.stack,
      });

      throw error;
    } finally {
      session.endSession();
    }
  }

  async processWebhook(payload, signature) {
    const webhookData = await paymentProvider.processWebhook({
      payload,
      signature,
    });

    const existingPayment = await subscriptionPaymentRepository.findByOrderId(webhookData.providerOrderId);

    if (existingPayment && existingPayment.status === 'COMPLETED') {
      logger.info('Duplicate webhook processed for completed payment', {
        paymentId: existingPayment._id,
        orderId: webhookData.providerOrderId,
      });

      return existingPayment;
    }

    if (!existingPayment) {
      logger.warn('Webhook received for unknown payment order', {
        orderId: webhookData.providerOrderId,
      });

      return null;
    }

    const subscription = await subscriptionRepository.findById(existingPayment.subscription);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    if (webhookData.status === 'COMPLETED') {
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        const payment = await subscriptionPaymentRepository.update(
          existingPayment._id,
          {
            providerPaymentId: webhookData.providerPaymentId,
            providerSignature: webhookData.providerSignature,
            status: 'COMPLETED',
            paidAt: webhookData.paidAt,
            metadata: {
              ...existingPayment.metadata,
              webhookPayload: payload,
              processedAt: new Date(),
            },
          },
          existingPayment.tenant,
          session
        );

        const normalizedCycle = payment.billingCycle || subscription.billingCycle || 'MONTHLY';

        if (subscription.status === 'ACTIVE' || subscription.status === 'GRACE_PERIOD' || subscription.status === 'PAYMENT_FAILED' || subscription.status === 'EXPIRED') {
          await subscriptionService.renewSubscription(
            subscription.tenant,
            normalizedCycle,
            webhookData.providerPaymentId
          );
        } else {
          const now = new Date();
          const endDate = new Date(now);

          if (normalizedCycle === 'YEARLY') {
            endDate.setFullYear(endDate.getFullYear() + 1);
          } else {
            endDate.setMonth(endDate.getMonth() + 1);
          }

          await subscriptionRepository.update(
            subscription._id,
            {
              status: 'ACTIVE',
              billingCycle: normalizedCycle,
              startDate: now,
              endDate,
            },
            session
          );
        }

        await session.commitTransaction();

        try {
          const tenant = await tenantRepository.findById(subscription.tenant);
          const owner = tenant?.owner;

          if (owner) {
            await notificationService.createSubscriptionNotification(
              {
                category: 'SUBSCRIPTION',
                eventType: 'PAYMENT_SUCCESS',
                title: 'Payment Successful',
                message: `Your payment was successful via webhook. Your subscription has been activated.`,
                type: 'SUCCESS',
                recipient: owner._id,
                status: 'ACTIVE',
              },
              subscription.tenant
            );
          }
        } catch (notifError) {
          logger.error('Failed to create payment success notification (webhook)', {
            error: notifError.message,
            orderId: webhookData.providerOrderId,
          });
        }

        logger.info('Subscription activated/renewed via webhook', {
          paymentId: payment._id,
          subscriptionId: subscription._id,
          orderId: webhookData.providerOrderId,
        });

        return payment;
      } catch (error) {
        await session.abortTransaction();

        logger.error('Webhook processing transaction failed', {
          error: error.message,
          orderId: webhookData.providerOrderId,
          stack: error.stack,
        });

        throw error;
      } finally {
        session.endSession();
      }
    }

    await subscriptionPaymentRepository.update(existingPayment._id, {
      status: 'FAILED',
      failureReason: webhookData.failureReason,
    }, existingPayment.tenant);

    const terminalStates = ['EXPIRED', 'CANCELLED', 'SUSPENDED'];

    if (!terminalStates.includes(subscription.status)) {
      await subscriptionService.markPaymentFailed(subscription._id);
      await subscriptionService.enterGracePeriod(subscription._id);
    }

    logger.warn('Payment failed via webhook', {
      orderId: webhookData.providerOrderId,
      reason: webhookData.failureReason,
    });

    return existingPayment;
  }

  async getPaymentHistory(tenantId, query) {
    const { page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const payments = await subscriptionPaymentRepository.findByTenant(tenantId, {
      skip,
      limit: Number(limit),
    });

    const total = await subscriptionPaymentRepository.count({
      tenant: tenantId,
      isDeleted: false,
    });

    return {
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getPaymentById(paymentId, tenantId) {
    const payment = await subscriptionPaymentRepository.findById(paymentId, tenantId);

    if (!payment) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Payment not found.'
      );
    }

    if (tenantId && payment.tenant?.toString() !== tenantId.toString()) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to access this payment.'
      );
    }

    return payment;
  }

  async getSubscriptionPayments(subscriptionId, query, tenantId) {
    const { page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const payments = await subscriptionPaymentRepository.findBySubscription(subscriptionId, {
      skip,
      limit: Number(limit),
    }, tenantId);

    const total = await subscriptionPaymentRepository.count({
      subscription: subscriptionId,
      isDeleted: false,
    }, tenantId);

    return {
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }
}

export default new SubscriptionPaymentService();
