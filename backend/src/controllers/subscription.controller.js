import subscriptionService from '../services/subscription.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

const createSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.createSubscription(
    req.body.tenantId,
    req.body.planId,
    req.body.billingCycle
  );
  return ApiResponse.created(res, subscription, 'Subscription created successfully.');
});

const getSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.getSubscription(req.query, req.user);
  return ApiResponse.success(res, subscription, 'Subscription fetched successfully.');
});

const getCurrentSubscription = asyncHandler(async (req, res) => {
  const tenantId = req.query.tenantId || req.user.tenantId;
  const subscription = await subscriptionService.getCurrentSubscription(tenantId);
  if (!subscription) {
    return ApiResponse.success(res, null, 'No subscription found.');
  }
  return ApiResponse.success(res, subscription, 'Current subscription fetched successfully.');
});

const getSubscriptions = asyncHandler(async (req, res) => {
  const result = await subscriptionService.getSubscriptions(req.query);
  return ApiResponse.paginated(res, result.subscriptions, result.pagination, 'Subscriptions fetched successfully.');
});

const updateSubscriptionStatus = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.updateSubscriptionStatus(
    req.params.id,
    req.body.status
  );
  return ApiResponse.success(res, subscription, 'Subscription status updated successfully.');
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.cancelSubscription(req.params.id);
  return ApiResponse.success(res, subscription, 'Subscription cancelled successfully.');
});

export default {
  createSubscription,
  getSubscription,
  getCurrentSubscription,
  getSubscriptions,
  updateSubscriptionStatus,
  cancelSubscription,
};
