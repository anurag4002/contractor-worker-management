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
  const tenantId = req.user.tenantId;

  if (!tenantId) {
    return ApiResponse.success(res, null, 'No subscription found.');
  }

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
    req.body.status,
    req.user.tenantId
  );
  return ApiResponse.success(res, subscription, 'Subscription status updated successfully.');
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.cancelSubscription(req.params.id, req.user.tenantId);
  return ApiResponse.success(res, subscription, 'Auto-renewal disabled successfully. Access will continue until the current period ends.');
});

const renewSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.renewSubscription(
    req.user.tenantId,
    req.body.billingCycle
  );
  return ApiResponse.success(res, subscription, 'Subscription renewed successfully.');
});

const suspendSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.suspendSubscription(req.params.id, req.user.tenantId);
  return ApiResponse.success(res, subscription, 'Subscription suspended successfully.');
});

const checkExpiredSubscriptions = asyncHandler(async (req, res) => {
  const result = await subscriptionService.checkAndExpireSubscriptions();
  return ApiResponse.success(res, result, 'Expired subscriptions processed successfully.');
});

const checkTrialReminders = asyncHandler(async (req, res) => {
  const result = await subscriptionService.checkTrialReminders();
  return ApiResponse.success(res, result, 'Trial reminders processed successfully.');
});

export default {
  createSubscription,
  getSubscription,
  getCurrentSubscription,
  getSubscriptions,
  updateSubscriptionStatus,
  cancelSubscription,
  renewSubscription,
  suspendSubscription,
  checkExpiredSubscriptions,
  checkTrialReminders,
};
