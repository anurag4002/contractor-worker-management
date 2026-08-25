import { StatusCodes } from 'http-status-codes';

import subscriptionPlanRepository from '../repositories/subscriptionPlan.repository.js';

import ApiError from '../common/errors/ApiError.js';

import SUBSCRIPTION_PLAN_MESSAGES from '../common/constants/subscriptionPlan.messages.js';

class SubscriptionPlanService {
  async getPublicPlans() {
    const plans = await subscriptionPlanRepository.findAll(
      { status: 'ACTIVE', isDeleted: false },
      { sort: { createdAt: 1 }, skip: 0, limit: 100 }
    );

    return plans.map((plan) => ({
      id: plan._id,
      name: plan.name,
      code: plan.code,
      description: plan.description,
      monthlyPrice: plan.pricing?.monthly || 0,
      yearlyPrice: plan.pricing?.annual || 0,
      currency: plan.currency || 'INR',
      features: plan.features || [],
      limits: plan.limits || {},
    }));
  }

  async createSubscriptionPlan(planData) {
    const { name, code, description } = planData;

    const normalizedCode = code.toUpperCase();

    const existingCode = await subscriptionPlanRepository.findByCode(normalizedCode);
    if (existingCode) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        SUBSCRIPTION_PLAN_MESSAGES.CODE_ALREADY_EXISTS
      );
    }

    const plan = await subscriptionPlanRepository.create({
      name,
      code: normalizedCode,
      description,
      pricing: planData.pricing,
      currency: planData.currency || 'INR',
      features: planData.features || [],
      limits: planData.limits || {
        maxWorkers: null,
        maxSites: null,
        maxAdmins: null,
      },
      status: planData.status || 'ACTIVE',
    });

    return await subscriptionPlanRepository.findById(plan._id);
  }

  async getSubscriptionPlans(query) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter = { isDeleted: false };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const plans = await subscriptionPlanRepository.findAll(filter, {
      skip,
      limit: Number(limit),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    });

    const total = await subscriptionPlanRepository.count(filter);

    return {
      plans,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getSubscriptionPlanById(planId) {
    const plan = await subscriptionPlanRepository.findById(planId);

    if (!plan) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_PLAN_MESSAGES.PLAN_NOT_FOUND
      );
    }

    return plan;
  }

  async getSubscriptionPlanByCode(code) {
    const plan = await subscriptionPlanRepository.findByCode(code);

    if (!plan) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_PLAN_MESSAGES.PLAN_NOT_FOUND
      );
    }

    return plan;
  }

  async updateSubscriptionPlan(planId, updateData) {
    const plan = await subscriptionPlanRepository.findById(planId);

    if (!plan) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_PLAN_MESSAGES.PLAN_NOT_FOUND
      );
    }

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();

      const existingCode = await subscriptionPlanRepository.findByCode(updateData.code);
      if (existingCode && existingCode._id.toString() !== planId) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          SUBSCRIPTION_PLAN_MESSAGES.CODE_ALREADY_EXISTS
        );
      }
    }

    return await subscriptionPlanRepository.update(planId, updateData);
  }

  async deleteSubscriptionPlan(planId) {
    const plan = await subscriptionPlanRepository.findById(planId);

    if (!plan) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        SUBSCRIPTION_PLAN_MESSAGES.PLAN_NOT_FOUND
      );
    }

    await subscriptionPlanRepository.softDelete(planId);

    return {
      message: SUBSCRIPTION_PLAN_MESSAGES.DELETED_SUCCESS,
    };
  }
}

export default new SubscriptionPlanService();
