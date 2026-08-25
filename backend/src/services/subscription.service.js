import { StatusCodes } from 'http-status-codes';

import subscriptionRepository from '../repositories/subscription.repository.js';

import subscriptionPlanRepository from '../repositories/subscriptionPlan.repository.js';

import tenantRepository from '../repositories/tenant.repository.js';

import notificationRepository from '../repositories/notification.repository.js';

import ApiError from '../common/errors/ApiError.js';

import SUBSCRIPTION_MESSAGES from '../common/constants/subscription.messages.js';

import logger from '../common/logger/logger.js';

import notificationService from './notification.service.js';

class SubscriptionService {
  async _getTenantOwner(tenantId) {
    const tenant = await tenantRepository.findById(tenantId);
    return tenant?.owner || null;
  }

  async _notifySubscriptionEvent(
    tenantId,
    eventType,
    title,
    message,
    type = 'INFO'
  ) {
    try {
      const owner = await this._getTenantOwner(tenantId);
      if (!owner) return;

      await notificationService.createSubscriptionNotification(
        {
          category: 'SUBSCRIPTION',
          eventType,
          title,
          message,
          type,
          recipient: owner._id,
          status: 'ACTIVE',
        },
        tenantId
      );
    } catch (error) {
      logger.error('Failed to create subscription notification', {
        error: error.message,
        tenantId,
        eventType,
      });
    }
  }

  _addPeriod(date, billingCycle) {
    const result = new Date(date);

    if (billingCycle === 'YEARLY') {
      result.setFullYear(result.getFullYear() + 1);
    } else {
      result.setMonth(result.getMonth() + 1);
    }

    return result;
  }

  async createTrialSubscription(tenantId, billingCycle = 'MONTHLY') {
    const plan = await subscriptionPlanRepository.findByCode('CONTRACTOR_PRO');
    if (!plan) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND
      );
    }

    const existingSubscription = await subscriptionRepository.findByTenant(tenantId);
    if (existingSubscription) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        SUBSCRIPTION_MESSAGES.TRIAL_SUBSCRIPTION_EXISTS
      );
    }

    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 7);

    const normalizedCycle = billingCycle?.toUpperCase() === 'YEARLY' ? 'YEARLY' : 'MONTHLY';

    const subscription = await subscriptionRepository.create({
      tenant: tenantId,
      plan: plan._id,
      status: 'TRIAL',
      billingCycle: normalizedCycle,
      startDate: null,
      endDate: null,
      trialStart: now,
      trialEndDate: trialEnd,
      autoRenew: false,
    });

    await this._notifySubscriptionEvent(
      tenantId,
      'TRIAL_STARTED',
      'Trial Started',
      `Your ${plan.name || 'trial'} subscription has started. It will expire on ${trialEnd.toLocaleDateString('en-IN')}.`,
      'SUCCESS'
    );

    return await subscriptionRepository.findById(subscription._id);
  }

  async isTrialActive(subscription) {
    if (!subscription || subscription.status !== 'TRIAL') {
      return false;
    }

    const now = new Date();
    const trialEnd = new Date(subscription.trialEndDate);
    return now < trialEnd;
  }

  async isTrialExpired(subscription) {
    if (!subscription || subscription.status !== 'TRIAL') {
      return false;
    }

    const now = new Date();
    const trialEnd = new Date(subscription.trialEndDate);
    return now >= trialEnd;
  }

  async getTrialDaysRemaining(subscription) {
    if (!subscription || subscription.status !== 'TRIAL') {
      return 0;
    }

    const now = new Date();
    const trialEnd = new Date(subscription.trialEndDate);

    if (now >= trialEnd) {
      return 0;
    }

    const diff = trialEnd - now;
    const days = diff / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(days));
  }

  async getSubscriptionStatus(tenantId) {
    let subscription = await subscriptionRepository.findByTenant(tenantId);

    if (!subscription) {
      return null;
    }

    const now = new Date();

    if (subscription.status === 'TRIAL' && await this.isTrialExpired(subscription)) {
      subscription = await subscriptionRepository.update(subscription._id, {
        status: 'EXPIRED',
      });
    } else if (
      subscription.endDate < now &&
      !['EXPIRED', 'CANCELLED', 'SUSPENDED', 'GRACE_PERIOD'].includes(subscription.status)
    ) {
      subscription = await subscriptionRepository.update(subscription._id, {
        status: 'EXPIRED',
      });
    } else if (
      subscription.status === 'GRACE_PERIOD' &&
      subscription.gracePeriodEndsAt &&
      subscription.gracePeriodEndsAt < now
    ) {
      subscription = await subscriptionRepository.update(subscription._id, {
        status: 'EXPIRED',
      });
    }

    return subscription;
  }

  async isSubscriptionActive(tenantId) {
    const subscription = await this.getSubscriptionStatus(tenantId);

    if (!subscription) {
      return false;
    }

    if (subscription.status === 'ACTIVE' || subscription.status === 'GRACE_PERIOD') {
      return true;
    }

    if (subscription.status === 'TRIAL') {
      return await this.isTrialActive(subscription);
    }

    if (subscription.status === 'CANCELLED' && subscription.endDate > new Date()) {
      return true;
    }

    return false;
  }

  async createSubscription(tenantId, planId, billingCycle) {
    const existingSubscription = await subscriptionRepository.findActiveByTenant(tenantId);
    if (existingSubscription) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        SUBSCRIPTION_MESSAGES.ACTIVE_SUBSCRIPTION_EXISTS
      );
    }

    const plan = await subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.PLAN_NOT_FOUND
      );
    }

    const now = new Date();
    const startDate = now;
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + (billingCycle === 'YEARLY' ? 365 : 30));

    const subscription = await subscriptionRepository.create({
      tenant: tenantId,
      plan: planId,
      status: 'ACTIVE',
      billingCycle,
      startDate,
      endDate,
      autoRenew: true,
    });

    return await subscriptionRepository.findById(subscription._id);
  }

  async getSubscription(query, requestingUser) {
    const { tenantId } = query;

    const isSuperAdmin = requestingUser.permissions?.includes('SUBSCRIPTION_READ_ALL')
      || requestingUser.role === 'SUPER_ADMIN';

    const targetTenantId = isSuperAdmin ? tenantId : requestingUser.tenantId;

    if (!targetTenantId) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        SUBSCRIPTION_MESSAGES.TENANT_ID_REQUIRED
      );
    }

    const subscription = await this.getSubscriptionStatus(targetTenantId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    return subscription;
  }

  async getCurrentSubscription(tenantId) {
    const subscription = await this.getSubscriptionStatus(tenantId);

    if (!subscription) {
      return null;
    }

    const daysRemaining = subscription.status === 'TRIAL'
      ? await this.getTrialDaysRemaining(subscription)
      : 0;

    const populatedSubscription = await subscriptionRepository.findById(subscription._id, tenantId);

    return {
      status: populatedSubscription?.status || subscription.status,
      plan: populatedSubscription?.plan?.code || populatedSubscription?.plan?.name || subscription.plan?.code || subscription.plan?.name,
      billingCycle: populatedSubscription?.billingCycle || subscription.billingCycle,
      trialStart: populatedSubscription?.trialStart || subscription.trialStart,
      trialEnd: populatedSubscription?.trialEndDate || subscription.trialEndDate,
      daysRemaining,
      startDate: populatedSubscription?.startDate || subscription.startDate,
      endDate: populatedSubscription?.endDate || subscription.endDate,
    };
  }

  async getSubscriptions(query) {
    const {
      page = 1,
      limit = 10,
      status,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter = { isDeleted: false };

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { status: { $regex: search, $options: 'i' } },
        { billingCycle: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const subscriptions = await subscriptionRepository.findAll(filter, {
      skip,
      limit: Number(limit),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    });

    const total = await subscriptionRepository.count(filter);

    return {
      subscriptions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async renewSubscription(tenantId, billingCycle, paymentId = null) {
    const subscription = await subscriptionRepository.findByTenant(tenantId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    const normalizedCycle = billingCycle?.toUpperCase() || subscription.billingCycle || 'MONTHLY';

    if (!['MONTHLY', 'YEARLY'].includes(normalizedCycle)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Invalid billing cycle.'
      );
    }

    const now = new Date();
    let startDate;
    let endDate;

    const terminalStates = ['EXPIRED', 'CANCELLED', 'SUSPENDED'];

    if (terminalStates.includes(subscription.status)) {
      startDate = now;
      endDate = this._addPeriod(now, normalizedCycle);
    } else if (subscription.endDate > now) {
      startDate = subscription.endDate;
      endDate = this._addPeriod(subscription.endDate, normalizedCycle);
    } else {
      startDate = now;
      endDate = this._addPeriod(now, normalizedCycle);
    }

    const updatePayload = {
      status: 'ACTIVE',
      billingCycle: normalizedCycle,
      startDate,
      endDate,
      autoRenew: true,
      gracePeriodEndsAt: null,
      paymentFailedAt: null,
      metadata: {
        ...(subscription.metadata || {}),
        lastRenewalPaymentId: paymentId || subscription.metadata?.lastRenewalPaymentId,
        lastRenewedAt: now,
      },
    };

    const updated = await subscriptionRepository.update(subscription._id, updatePayload);

    await this._notifySubscriptionEvent(
      tenantId,
      'SUBSCRIPTION_RENEWED',
      'Subscription Renewed',
      `Your subscription has been renewed successfully. New period ends on ${endDate.toLocaleDateString('en-IN')}.`,
      'SUCCESS'
    );

    logger.info('Subscription renewed', {
      subscriptionId: subscription._id,
      tenantId,
      billingCycle: normalizedCycle,
      startDate,
      endDate,
      paymentId,
    });

    return updated;
  }

  async markPaymentFailed(subscriptionId, tenantId) {
    const subscription = await subscriptionRepository.findById(subscriptionId, tenantId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    await this._notifySubscriptionEvent(
      subscription.tenant,
      'PAYMENT_FAILED',
      'Payment Failed',
      'Your recent subscription payment failed. Please update your payment method to avoid service interruption.',
      'ERROR'
    );

    return await subscriptionRepository.update(subscriptionId, {
      status: 'PAYMENT_FAILED',
      paymentFailedAt: new Date(),
    }, tenantId);
  }

  async enterGracePeriod(subscriptionId, tenantId) {
    const subscription = await subscriptionRepository.findById(subscriptionId, tenantId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    const graceEndsAt = new Date();
    graceEndsAt.setDate(graceEndsAt.getDate() + 7);

    return await subscriptionRepository.update(subscriptionId, {
      status: 'GRACE_PERIOD',
      gracePeriodEndsAt: graceEndsAt,
    }, tenantId);
  }

  async activateFromGracePeriod(subscriptionId, paymentId = null, tenantId) {
    const subscription = await subscriptionRepository.findById(subscriptionId, tenantId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    const now = new Date();
    const endDate = this._addPeriod(now, subscription.billingCycle || 'MONTHLY');

    return await subscriptionRepository.update(subscriptionId, {
      status: 'ACTIVE',
      startDate: now,
      endDate,
      gracePeriodEndsAt: null,
      paymentFailedAt: null,
      metadata: {
        ...(subscription.metadata || {}),
        lastRenewalPaymentId: paymentId || subscription.metadata?.lastRenewalPaymentId,
        lastRenewedAt: now,
      },
    }, tenantId);
  }

  async suspendSubscription(subscriptionId, tenantId) {
    const subscription = await subscriptionRepository.findById(subscriptionId, tenantId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    return await subscriptionRepository.update(subscriptionId, {
      status: 'SUSPENDED',
    }, tenantId);
  }

  async expireSubscription(subscriptionId, tenantId) {
    const subscription = await subscriptionRepository.findById(subscriptionId, tenantId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    return await subscriptionRepository.update(subscriptionId, {
      status: 'EXPIRED',
    }, tenantId);
  }

  async checkAndExpireSubscriptions() {
    const now = new Date();

    const subscriptions = await subscriptionRepository.findExpiredSubscriptions(now, {
      skip: 0,
      limit: 1000,
      sort: { endDate: 1 },
    });

    const expiredIds = [];

    for (const subscription of subscriptions) {
      await subscriptionRepository.update(subscription._id, {
        status: 'EXPIRED',
      });

      await this._notifySubscriptionEvent(
        subscription.tenant,
        'TRIAL_EXPIRED',
        'Trial Expired',
        'Your trial has expired. Please subscribe to continue using the service.',
        'ERROR'
      );

      expiredIds.push(subscription._id);
    }

    await this.checkTrialReminders();

    logger.info('Subscription expiry check completed', {
      checked: subscriptions.length,
      expired: expiredIds.length,
    });

    return {
      checked: subscriptions.length,
      expired: expiredIds.length,
      expiredIds,
    };
  }

  async checkTrialReminders() {
    const now = new Date();

    const trials = await subscriptionRepository.findAll(
      {
        status: 'TRIAL',
        isDeleted: false,
        trialEndDate: { $gt: now },
      },
      {}
    );

    const remindersSent = [];

    for (const subscription of trials) {
      const trialEnd = new Date(subscription.trialEndDate);
      const diff = trialEnd - now;
      const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

      const owner = await this._getTenantOwner(subscription.tenant);
      if (!owner) continue;

      if (daysRemaining === 3) {
        const alreadySent =
          await notificationRepository.findDuplicate(
            'SUBSCRIPTION',
            'TRIAL_ENDING_SOON_3_DAYS',
            owner._id,
            subscription.tenant
          );

        if (!alreadySent) {
          await this._notifySubscriptionEvent(
            subscription.tenant,
            'TRIAL_ENDING_SOON_3_DAYS',
            'Trial Ending Soon',
            `Your trial will expire in 3 days. Please subscribe to continue using the service.`,
            'WARNING'
          );
          remindersSent.push({
            subscriptionId: subscription._id,
            reminder: '3_DAYS',
          });
        }
      }

      if (daysRemaining === 1) {
        const alreadySent =
          await notificationRepository.findDuplicate(
            'SUBSCRIPTION',
            'TRIAL_ENDING_SOON_1_DAY',
            owner._id,
            subscription.tenant
          );

        if (!alreadySent) {
          await this._notifySubscriptionEvent(
            subscription.tenant,
            'TRIAL_ENDING_SOON_1_DAY',
            'Trial Expiring Tomorrow',
            'Your trial will expire tomorrow. Please subscribe now to avoid service interruption.',
            'ERROR'
          );
          remindersSent.push({
            subscriptionId: subscription._id,
            reminder: '1_DAY',
          });
        }
      }
    }

    return { remindersSent };
  }

  async updateSubscriptionStatus(subscriptionId, status) {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    const updatePayload = { status };

    if (status === 'CANCELLED') {
      updatePayload.cancelledAt = new Date();
    }

    if (status === 'PAYMENT_FAILED') {
      updatePayload.paymentFailedAt = new Date();
    }

    if (status === 'GRACE_PERIOD') {
      const graceEndsAt = new Date();
      graceEndsAt.setDate(graceEndsAt.getDate() + 7);
      updatePayload.gracePeriodEndsAt = graceEndsAt;
    }

    return await subscriptionRepository.update(subscriptionId, updatePayload);
  }

  async cancelSubscription(subscriptionId) {
    const subscription = await subscriptionRepository.findById(subscriptionId);

    if (!subscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND
      );
    }

    if (!subscription.autoRenew) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Auto-renewal is already disabled for this subscription.'
      );
    }

    await this._notifySubscriptionEvent(
      subscription.tenant,
      'SUBSCRIPTION_CANCELLED',
      'Subscription Cancelled',
      'Auto-renewal has been disabled for your subscription. You will continue to have access until the current period ends.',
      'WARNING'
    );

    return await subscriptionRepository.update(subscriptionId, {
      autoRenew: false,
    });
  }
}

export default new SubscriptionService();
