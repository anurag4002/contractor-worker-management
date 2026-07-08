import { StatusCodes } from 'http-status-codes';

import authService from '../services/auth.service.js';

import ApiResponse from '../common/helpers/ApiResponse.js';
import asyncHandler from '../common/helpers/asyncHandler.js';

import AUTH_MESSAGES from '../common/constants/auth.messages.js';

/**
 * Register User
 */
const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return ApiResponse.created(
    res,
    user,
    AUTH_MESSAGES.REGISTER.SUCCESS
  );
});

/**
 * Login User
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  return ApiResponse.success(
    res,
    result,
    AUTH_MESSAGES.LOGIN.SUCCESS
  );
});
export default {
  register,
  login,
};