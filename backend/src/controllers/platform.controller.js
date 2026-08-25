import platformService from '../services/platform.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

const getPlatformDashboard = asyncHandler(async (req, res) => {
  const stats = await platformService.getPlatformDashboard();
  return ApiResponse.success(res, stats, 'Platform dashboard fetched successfully.');
});

const getPlatformTenants = asyncHandler(async (req, res) => {
  const result = await platformService.getTenants(req.query, req.user);
  return ApiResponse.paginated(res, result.tenants, result.pagination, 'Contractors fetched successfully.');
});

const getPlatformTenantDetails = asyncHandler(async (req, res) => {
  const data = await platformService.getTenantDetails(req.params.tenantId, req.user);
  return ApiResponse.success(res, data, 'Contractor details fetched successfully.');
});

const getPlatformTenantSubscription = asyncHandler(async (req, res) => {
  const subscription = await platformService.getTenantSubscription(req.params.tenantId, req.user);
  return ApiResponse.success(res, subscription, 'Contractor subscription fetched successfully.');
});

export default {
  getPlatformDashboard,
  getPlatformTenants,
  getPlatformTenantDetails,
  getPlatformTenantSubscription,
};
