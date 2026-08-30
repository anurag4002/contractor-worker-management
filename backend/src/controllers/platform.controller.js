import platformService from '../services/platform.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

const getPlatformDashboard = asyncHandler(async (req, res) => {
  const stats = await platformService.getPlatformDashboard();
  return ApiResponse.success(res, stats, 'Platform dashboard fetched successfully.');
});

const getPlatformTenants = asyncHandler(async (req, res) => {
  const result = await platformService.getTenants(req.query);
  return ApiResponse.paginated(res, result.tenants, result.pagination, 'Contractors fetched successfully.');
});

const getPlatformTenantDetails = asyncHandler(async (req, res) => {
  const data = await platformService.getTenantDetails(req.params.tenantId);
  return ApiResponse.success(res, data, 'Contractor details fetched successfully.');
});

const getPlatformTenantSubscription = asyncHandler(async (req, res) => {
  const subscription = await platformService.getTenantSubscription(req.params.tenantId);
  return ApiResponse.success(res, subscription, 'Contractor subscription fetched successfully.');
});

const getPlatformPayments = asyncHandler(async (req, res) => {
  const result = await platformService.getPayments(req.query);
  return ApiResponse.paginated(res, result.payments, result.pagination, 'Payments fetched successfully.');
});

const getPlatformPaymentById = asyncHandler(async (req, res) => {
  const payment = await platformService.getPaymentById(req.params.paymentId);
  return ApiResponse.success(res, payment, 'Payment fetched successfully.');
});

const getPlatformExpiringSubscriptions = asyncHandler(async (req, res) => {
  const result = await platformService.getExpiringSubscriptions(req.query);
  return ApiResponse.paginated(res, result.subscriptions, result.pagination, 'Expiring subscriptions fetched successfully.');
});

const getPlatformRecentUsers = asyncHandler(async (req, res) => {
  const users = await platformService.getRecentUsers(req.query.limit);
  return ApiResponse.success(res, users, 'Recent users fetched successfully.');
});

const getPlatformRecentPayments = asyncHandler(async (req, res) => {
  const payments = await platformService.getRecentPayments(req.query.limit);
  return ApiResponse.success(res, payments, 'Recent payments fetched successfully.');
});

export default {
  getPlatformDashboard,
  getPlatformTenants,
  getPlatformTenantDetails,
  getPlatformTenantSubscription,
  getPlatformPayments,
  getPlatformPaymentById,
  getPlatformExpiringSubscriptions,
  getPlatformRecentUsers,
  getPlatformRecentPayments,
};
