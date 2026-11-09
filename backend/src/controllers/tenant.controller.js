import tenantService from '../services/tenant.service.js';
import ApiResponse from '../common/helpers/ApiResponse.js';
import asyncHandler from '../common/helpers/asyncHandler.js';

const createTenant = asyncHandler(async (req, res) => {
  const tenant = await tenantService.createTenant(req.body, req.user.userId);
  return ApiResponse.created(res, tenant, 'Tenant created successfully.');
});

const getTenants = asyncHandler(async (req, res) => {
  const result = await tenantService.getTenants(req.query, req.user);
  return ApiResponse.paginated(res, result.tenants, result.pagination, 'Tenants fetched successfully.');
});

const getTenantById = asyncHandler(async (req, res) => {
  const tenant = await tenantService.getTenantById(req.params.id, req.user);
  return ApiResponse.success(res, tenant, 'Tenant fetched successfully.');
});

const getMyTenant = asyncHandler(async (req, res) => {
  const tenantId = req.user?.tenantId || (req.user?.tenant?._id) || null;

  if (!tenantId) {
    return ApiResponse.success(res, null, 'Tenant not found.');
  }

  const tenant = await tenantService.getTenantById(tenantId, req.user);

  return ApiResponse.success(res, tenant, 'Tenant fetched successfully.');
});

const updateTenant = asyncHandler(async (req, res) => {
  const tenant = await tenantService.updateTenant(req.params.id, req.body, req.user);
  return ApiResponse.success(res, tenant, 'Tenant updated successfully.');
});

export default {
  createTenant,
  getTenants,
  getTenantById,
  getMyTenant,
  updateTenant,
};
