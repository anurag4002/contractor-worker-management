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
/**
 * Refresh Access Token
 */
const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshToken(refreshToken);

    return ApiResponse.success(
        res,
        tokens,
        AUTH_MESSAGES.TOKEN.REFRESH_SUCCESS
    );
});
/**
 * Logout User
 */
const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user.userId);

    return ApiResponse.success(
        res,
        null,
        AUTH_MESSAGES.LOGOUT.SUCCESS
    );
});
/**
 * Forgot Password
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    return ApiResponse.success(
        res,
        result,
        result.message
    );
});
/**
 * Reset Password
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    const result = await authService.resetPassword(
        token,
        password
    );

    return ApiResponse.success(
        res,
        result,
        AUTH_MESSAGES.PASSWORD.RESET_SUCCESS
    );
});
/**
 * Change Password
 */
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    await authService.changePassword(
        req.user.userId,
        oldPassword,
        newPassword
    );

    return ApiResponse.success(
        res,
        null,
        AUTH_MESSAGES.PASSWORD.CHANGED
    );
});
/**
 * Get User Profile
 */
const getProfile = asyncHandler(async (req, res) => {
    const profile = await authService.getProfile(
        req.user.userId
    );

    return ApiResponse.success(
        res,
        profile,
        AUTH_MESSAGES.PROFILE.FETCH_SUCCESS
    );
});
/**
 * Update User Profile
 */
const updateProfile = asyncHandler(async (req, res) => {
    const updatedProfile = await authService.updateProfile(
        req.user.userId,
        req.body
    );

    return ApiResponse.success(
        res,
        updatedProfile,
        AUTH_MESSAGES.PROFILE.UPDATE_SUCCESS
    );
});

export default {
    register,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    getProfile,
    updateProfile,
};