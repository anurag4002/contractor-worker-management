import roleService from '../services/role.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

/**
 * ==========================================
 * Create Role
 * ==========================================
 */
const createRole = asyncHandler(async (req, res) => {
  const role = await roleService.createRole(req.body);

  return ApiResponse.created(
    res,
    role,
    'Role created successfully.'
  );
});

/**
 * ==========================================
 * Get All Roles
 * ==========================================
 */
const getRoles = asyncHandler(async (req, res) => {
  const result = await roleService.getRoles(req.query);

  return ApiResponse.paginated(
    res,
    result.roles,
    result.pagination,
    'Roles fetched successfully.'
  );
});

/**
 * ==========================================
 * Get Role By Id
 * ==========================================
 */
const getRoleById = asyncHandler(async (req, res) => {
  const role = await roleService.getRoleById(
    req.params.id
  );

  return ApiResponse.success(
    res,
    role,
    'Role fetched successfully.'
  );
});

/**
 * ==========================================
 * Update Role
 * ==========================================
 */
const updateRole = asyncHandler(async (req, res) => {
  const role = await roleService.updateRole(
    req.params.id,
    req.body
  );

  return ApiResponse.success(
    res,
    role,
    'Role updated successfully.'
  );
});

/**
 * ==========================================
 * Change Role Status
 * ==========================================
 */
const changeRoleStatus = asyncHandler(
  async (req, res) => {
    const role =
      await roleService.changeStatus(
        req.params.id,
        req.body.status
      );

    return ApiResponse.success(
      res,
      role,
      'Role status updated successfully.'
    );
  }
);

/**
 * ==========================================
 * Delete Role
 * ==========================================
 */
const deleteRole = asyncHandler(async (req, res) => {
  const result =
    await roleService.deleteRole(
      req.params.id
    );

  return ApiResponse.success(
    res,
    result,
    'Role deleted successfully.'
  );
});

export default {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  changeRoleStatus,
  deleteRole,
};