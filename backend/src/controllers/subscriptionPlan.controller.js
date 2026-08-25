import subscriptionPlanService from '../services/subscriptionPlan.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

const getPublicPlans = asyncHandler(async (req, res) => {
  const plans = await subscriptionPlanService.getPublicPlans();
  return ApiResponse.success(res, plans, 'Public plans fetched successfully.');
});

const createSubscriptionPlan = asyncHandler(async (req, res) => {
  const plan = await subscriptionPlanService.createSubscriptionPlan(req.body);
  return ApiResponse.created(res, plan, 'Subscription plan created successfully.');
});

const getSubscriptionPlans = asyncHandler(async (req, res) => {
  const result = await subscriptionPlanService.getSubscriptionPlans(req.query);
  return ApiResponse.paginated(res, result.plans, result.pagination, 'Subscription plans fetched successfully.');
});

const getSubscriptionPlanById = asyncHandler(async (req, res) => {
  const plan = await subscriptionPlanService.getSubscriptionPlanById(req.params.id);
  return ApiResponse.success(res, plan, 'Subscription plan fetched successfully.');
});

const getSubscriptionPlanByCode = asyncHandler(async (req, res) => {
  const plan = await subscriptionPlanService.getSubscriptionPlanByCode(req.params.code);
  return ApiResponse.success(res, plan, 'Subscription plan fetched successfully.');
});

const updateSubscriptionPlan = asyncHandler(async (req, res) => {
  const plan = await subscriptionPlanService.updateSubscriptionPlan(req.params.id, req.body);
  return ApiResponse.success(res, plan, 'Subscription plan updated successfully.');
});

const deleteSubscriptionPlan = asyncHandler(async (req, res) => {
  const result = await subscriptionPlanService.deleteSubscriptionPlan(req.params.id);
  return ApiResponse.success(res, result, result.message);
});

export default {
  getPublicPlans,
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  getSubscriptionPlanByCode,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};
