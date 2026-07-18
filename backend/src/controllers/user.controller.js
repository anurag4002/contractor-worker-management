import { StatusCodes } from 'http-status-codes';

import userService from '../services/user.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';
import asyncHandler from '../common/helpers/asyncHandler.js';

/**
 * ==========================================
 * Create User
 * ==========================================
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  return ApiResponse.created(
    res,
    user,
    'User created successfully.'
  );
});

/**
 * ==========================================
 * Get Users
 * ==========================================
 */
const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);

  return ApiResponse.paginated(
    res,
    result.users,
    result.pagination,
    'Users fetched successfully.'
  );
});

/**
 * ==========================================
 * Get User By Id
 * ==========================================
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return ApiResponse.success(
    res,
    user,
    'User fetched successfully.'
  );
});

/**
 * ==========================================
 * Update User
 * ==========================================
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(
    req.params.id,
    req.body
  );

  return ApiResponse.success(
    res,
    user,
    'User updated successfully.'
  );
});

/**
 * ==========================================
 * Change User Status
 * ==========================================
 */
const changeUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.changeStatus(
    req.params.id,
    req.body.status
  );

  return ApiResponse.success(
    res,
    user,
    'User status updated successfully.'
  );
});

/**
 * ==========================================
 * Delete User
 * ==========================================
 */
const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(
    req.params.id
  );

  return ApiResponse.success(
    res,
    result,
    'User deleted successfully.'
  );
});

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserStatus,
  deleteUser,
};