import { StatusCodes } from 'http-status-codes';

import subscriptionRepository from '../repositories/subscription.repository.js';

import subscriptionPlanRepository from '../repositories/subscriptionPlan.repository.js';

import ApiError from '../common/errors/ApiError.js';

import SUBSCRIPTION_MESSAGES from '../common/constants/subscription.messages.js';

class SubscriptionService {
  async createTrialSubscription(tenantId) {
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

    const subscription = await subscriptionRepository.create({
      tenant: tenantId,
      plan: plan._id,
      status: 'TRIAL',
      billingCycle: null,
      startDate: null,
      endDate: null,
      trialStart: now,
      trialEndDate: trialEnd,
      autoRenew: false,
    });

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

    if (subscription.status === 'TRIAL' && await this.isTrialExpired(subscription)) {
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

    if (subscription.status === 'ACTIVE') {
      return true;
    }

    if (subscription.status === 'TRIAL') {
      return await this.isTrialActive(subscription);
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
    endDate.setDate(endDate.getDate() + (billingCycle === 'ANNUAL' ? 365 : 30));

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

    return {
      status: subscription.status,
      plan: subscription.plan?.code || subscription.plan?.name,
      billingCycle: subscription.billingCycle,
      trialStart: subscription.trialStart,
      trialEnd: subscription.trialEndDate,
      daysRemaining,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
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

    if (subscription.status === 'CANCELLED') {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        SUBSCRIPTION_MESSAGES.SUBSCRIPTION_ALREADY_CANCELLED
      );
    }

    const now = new Date();

    return await subscriptionRepository.update(subscriptionId, {
      status: 'CANCELLED',
      cancelledAt: now,
      autoRenew: false,
    });
  }
}

export default new SubscriptionService();
