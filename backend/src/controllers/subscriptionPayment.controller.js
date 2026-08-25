import subscriptionPaymentService from '../services/subscriptionPayment.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

const createPaymentOrder = asyncHandler(async (req, res) => {
  const payment = await subscriptionPaymentService.createPaymentOrder(
    req.user.tenantId,
    req.body.billingCycle,
    req.user
  );

  return ApiResponse.created(res, payment, 'Payment order created successfully.');
});

const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await subscriptionPaymentService.verifyPaymentAndActivateSubscription(
    req.body
  );

  return ApiResponse.success(res, payment, 'Payment verified and subscription activated successfully.');
});

const processWebhook = asyncHandler(async (req, res) => {
  const payment = await subscriptionPaymentService.processWebhook(
    req.body,
    req.headers['x-razorpay-signature']
  );

  return ApiResponse.success(res, payment, 'Webhook processed successfully.');
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const result = await subscriptionPaymentService.getPaymentHistory(
    req.user.tenantId,
    req.query
  );

  return ApiResponse.paginated(res, result.payments, result.pagination, 'Payment history fetched successfully.');
});

const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await subscriptionPaymentService.getPaymentById(
    req.params.id,
    req.user.tenantId
  );

  return ApiResponse.success(res, payment, 'Payment fetched successfully.');
});

const getSubscriptionPayments = asyncHandler(async (req, res) => {
  const result = await subscriptionPaymentService.getSubscriptionPayments(
    req.params.subscriptionId,
    req.query,
    req.user.tenantId
  );

  return ApiResponse.paginated(res, result.payments, result.pagination, 'Subscription payments fetched successfully.');
});

export default {
  createPaymentOrder,
  verifyPayment,
  processWebhook,
  getPaymentHistory,
  getPaymentById,
  getSubscriptionPayments,
};
