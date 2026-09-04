import { StatusCodes } from 'http-status-codes';

import authRepository from '../repositories/auth.repository.js';
import Tenant from '../models/Tenant.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import ApiError from '../common/errors/ApiError.js';
import mongoose from 'mongoose';

import logger from '../common/logger/logger.js';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../common/utils/jwt.util.js';

import {
  comparePassword,
  hashPassword,
} from '../common/utils/password.util.js';

import { v4 as uuidv4 } from 'uuid';

import { generateRandomToken } from '../common/utils/token.util.js';

import AUTH_CONSTANTS from '../common/constants/auth.constants.js';

import AUTH_MESSAGES from '../common/constants/auth.messages.js';

import subscriptionService from '../services/subscription.service.js';

class AuthService {
  /**
   * Register User
   * - Always registers a new TENANT_ADMIN (contractor account)
   * - SUPER_ADMIN must be created via seeder only
   */
  async register(registerData) {
    const {
      fullName,
      email,
      mobileNumber,
      username,
      password,
      companyName,
      address,
      city,
      district,
      state,
      pincode,
      billingCycle,
    } = registerData;

    if (!companyName) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Company name is required for contractor registration.'
      );
    }

    return this._registerTenantAdmin({
      fullName,
      email,
      mobileNumber,
      username,
      password,
      companyName,
      address,
      city,
      district,
      state,
      pincode,
      billingCycle,
    });
  }

  /**
   * Register first SUPER_ADMIN (platform-level, no tenant)
   */
  async _registerSuperAdmin({ fullName, email, mobileNumber, password }, superAdminRole) {
    const existingEmail = await authRepository.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists.');
    }

    const existingMobile = await authRepository.findByMobileNumber(mobileNumber);
    if (existingMobile) {
      throw new ApiError(StatusCodes.CONFLICT, 'Mobile number already exists.');
    }

    const hashedPassword = await hashPassword(password);

    try {
      const createdUser = await authRepository.create({
        fullName,
        email,
        mobileNumber,
        password: hashedPassword,
        role: superAdminRole._id,
        tenant: null,
      });

      const user = await authRepository.findById(createdUser._id);

      return {
        user,
        accessToken: null,
        refreshToken: null,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError(StatusCodes.CONFLICT, 'Email, mobile number, or username already exists.');
      }
      throw error;
    }
  }

  /**
   * Register TENANT_ADMIN (creates new tenant + tenant admin user)
   */
  async _registerTenantAdmin({
    fullName,
    email,
    mobileNumber,
    username,
    password,
    companyName,
    address,
    city,
    district,
    state,
    pincode,
    billingCycle,
  }) {
    logger.info('[REGISTER] Starting tenant admin registration', {
      email,
      username,
      companyName,
      districtProvided: district !== undefined && district !== null && district !== '',
    });

    if (!companyName) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Company name is required for tenant registration.');
    }

    const existingEmail = await authRepository.findByEmail(email);
    if (existingEmail) {
      logger.warn('[REGISTER] Duplicate email', { email });
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists.');
    }

    const existingMobile = await authRepository.findByMobileNumber(mobileNumber);
    if (existingMobile) {
      logger.warn('[REGISTER] Duplicate mobile', { mobileNumber });
      throw new ApiError(StatusCodes.CONFLICT, 'Mobile number already exists.');
    }

    const tenantAdminRole = await authRepository.findRoleByCode('TENANT_ADMIN');
    if (!tenantAdminRole) {
      logger.error('[REGISTER] TENANT_ADMIN role not found');
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'TENANT_ADMIN role not found. Please run role seeder.'
      );
    }

    if (
      !tenantAdminRole.permissions ||
      tenantAdminRole.permissions.length === 0
    ) {
      const allPermissions = await authRepository.findAllPermissions();
      const permissionIds = allPermissions.map(
        (permission) => permission._id
      );

      await Role.findByIdAndUpdate(tenantAdminRole._id, {
        permissions: permissionIds,
      });

      tenantAdminRole.permissions = allPermissions;
    }

    const hashedPassword = await hashPassword(password);

    const normalizedCycle = billingCycle?.toUpperCase();
    const validCycle = normalizedCycle === 'YEARLY' ? 'YEARLY' : 'MONTHLY';

    const session = await mongoose.startSession();
    let tenant;
    let createdUser;

    try {
      await session.withTransaction(async () => {
        createdUser = await authRepository.create([{
          fullName,
          email,
          mobileNumber,
          username,
          password: hashedPassword,
          role: tenantAdminRole._id,
          tenant: null,
        }], { session });

        logger.info('[REGISTER] User created', {
          userId: createdUser[0]._id,
          email: createdUser[0].email,
        });

        tenant = await Tenant.create([{
          companyName,
          email,
          mobileNumber,
          address: address || null,
          city: city || null,
          district: district || null,
          state: state || null,
          pincode: pincode || null,
          status: 'ACTIVE',
          owner: createdUser[0]._id,
        }], { session });

        logger.info('[REGISTER] Tenant created', {
          tenantId: tenant[0]._id,
          companyName: tenant[0].companyName,
        });

        await authRepository.updateUserById(createdUser[0]._id, {
          tenant: tenant[0]._id,
        }, { session });

        logger.info('[REGISTER] User updated with tenant', {
          userId: createdUser[0]._id,
          tenantId: tenant[0]._id,
        });
      });

      await session.endSession();
    } catch (error) {
      await session.endSession();

      logger.error('[REGISTER] Transaction failed', {
        errorName: error.name,
        errorMessage: error.message,
        errorCode: error.code,
        stack: error.stack,
      });

      if (error.code === 11000) {
        throw new ApiError(StatusCodes.CONFLICT, 'Email, mobile number, or company already exists.');
      }
      throw error;
    }

    const payload = {
      userId: createdUser[0]._id,
      email: createdUser[0].email,
      role: tenantAdminRole.code,
      tenantId: tenant[0]._id,
    };

    try {
      logger.info('[REGISTER] Creating trial subscription', {
        tenantId: tenant[0]._id,
        billingCycle: validCycle,
      });
      await subscriptionService.createTrialSubscription(tenant[0]._id, validCycle);
      logger.info('[REGISTER] Trial subscription created');
    } catch (error) {
      logger.error('[REGISTER] Trial subscription failed', {
        errorName: error.name,
        errorMessage: error.message,
        errorCode: error.code,
        statusCode: error.statusCode,
        stack: error.stack,
      });
      if (error.statusCode !== StatusCodes.CONFLICT) {
        throw error;
      }
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = await hashPassword(refreshToken);
    await authRepository.saveRefreshToken(createdUser[0]._id, hashedRefreshToken);
    await authRepository.updateLastLogin(createdUser[0]._id);

    const user = await authRepository.findById(createdUser[0]._id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login User
   */
  async login(loginData) {
    const { email, password } = loginData;

    // Find user by email
    const user =
      await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS
      );
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        AUTH_MESSAGES.LOGIN.ACCOUNT_INACTIVE
      );
    }

    // Continue in Part 2...
        // Check role
    if (!user.role) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        AUTH_MESSAGES.ROLE.NOT_FOUND
      );
    }

    if (user.role.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        AUTH_MESSAGES.ROLE.INACTIVE
      );
    }

    // Check if account is locked
    if (user.lockUntil) {
      // Lock expired → unlock account
      if (user.lockUntil.getTime() <= Date.now()) {
        await authRepository.unlockAccount(user._id);

        user.failedLoginAttempts = 0;
        user.lockUntil = null;
      } else {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          AUTH_MESSAGES.LOGIN.ACCOUNT_LOCKED
        );
      }
    }

    // Compare password
    const isPasswordMatched =
      await comparePassword(
        password,
        user.password
      );

    if (!isPasswordMatched) {
      // Increment failed login attempts
      const updatedUser =
        await authRepository.incrementFailedLoginAttempts(
          user._id
        );

      // Lock account if maximum attempts reached
      if (
        updatedUser.failedLoginAttempts >=
        AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS
      ) {
        const lockUntil = new Date(
          Date.now() +
            AUTH_CONSTANTS.ACCOUNT_LOCK_DURATION
        );

        await authRepository.lockAccount(
          user._id,
          lockUntil
        );

        throw new ApiError(
          StatusCodes.FORBIDDEN,
          AUTH_MESSAGES.LOGIN.ACCOUNT_LOCKED
        );
      }

      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS
      );
    }

    // Password is correct
    await authRepository.resetFailedLoginAttempts(
      user._id
    );

    const tenantId = user.tenant ? user.tenant._id || user.tenant : null;

    // Prepare JWT Payload
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role.code,
      tenantId,
    };

    // Generate Tokens
    const accessToken =
      generateAccessToken(payload);

    const refreshToken =
      generateRefreshToken(payload);

    // Hash Refresh Token
    const hashedRefreshToken =
      await hashPassword(refreshToken);

    // Save Refresh Token
    await authRepository.saveRefreshToken(
      user._id,
      hashedRefreshToken
    );

    // Update Last Login
    await authRepository.updateLastLogin(
      user._id
    );

    // Fetch Updated User
    const loggedInUser =
      await authRepository.findUserById(
        user._id
      );

    return {
      user: loggedInUser,
      accessToken,
      refreshToken,
      tenantId,
    };
  }

  /**
   * Logout User
   */
  async logout(userId) {
    // Find User
    const user =
      await authRepository.findUserById(
        userId
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        AUTH_MESSAGES.USER.NOT_FOUND
      );
    }

    // Remove Refresh Token
    await authRepository.removeRefreshToken(
      userId
    );

    return {
      message: AUTH_MESSAGES.LOGOUT.SUCCESS,
    };
  }

  /**
   * Refresh Access Token
   */
  async refreshToken(refreshToken) {
      // Check token
    if (!refreshToken) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        AUTH_MESSAGES.TOKEN.REFRESH_REQUIRED
      );
    }

    // Verify Refresh Token
    const decoded =
      verifyRefreshToken(refreshToken);

    // Find User
    const user =
      await authRepository.findUserById(
        decoded.userId
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        AUTH_MESSAGES.USER.NOT_FOUND
      );
    }

    // Compare Refresh Token
    const isTokenValid =
      await comparePassword(
        refreshToken,
        user.refreshTokenHash
      );

    if (!isTokenValid) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.TOKEN.INVALID
      );
    }

    // JWT Payload
    const tenantId = user.tenant ? user.tenant._id || user.tenant : null;

    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role.code,
      tenantId,
    };

    // Generate New Tokens
    const newAccessToken =
      generateAccessToken(payload);

    const newRefreshToken =
      generateRefreshToken(payload);

    // Hash Refresh Token
    const hashedRefreshToken =
      await hashPassword(newRefreshToken);

    // Save New Refresh Token
    await authRepository.saveRefreshToken(
      user._id,
      hashedRefreshToken
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Forgot Password
   */
  async forgotPassword(email) {
    // Find User
    const user =
      await authRepository.findUserByEmail(email);

    /**
     * Never reveal whether account exists
     */
    if (!user) {
      return {
        message:
          'If an account exists with this email, a password reset link has been sent.',
      };
    }

    // Generate Token ID
    const tokenId = uuidv4();

    // Generate Secret
    const secret =
      generateRandomToken(32);

    // Hash Secret
    const hashedSecret =
      await hashPassword(secret);

    // Token Expiry
    const expiresAt = new Date(
      Date.now() +
        AUTH_CONSTANTS.PASSWORD_RESET_TOKEN_EXPIRY
    );

    // Save Reset Token
    await authRepository.savePasswordResetToken(
      user._id,
      tokenId,
      hashedSecret,
      expiresAt
    );

    /**
     * Final Token
     * tokenId.secret
     */
    const resetToken =
      `${tokenId}.${secret}`;

    const resetUrl = new URL(
      '/reset-password',
      process.env.FRONTEND_URL ||
        'http://localhost:5173'
    );

    resetUrl.searchParams.set(
      'token',
      resetToken
    );

    const resetLink =
      resetUrl.toString();

    const expiryMinutes =
      AUTH_CONSTANTS.PASSWORD_RESET_TOKEN_EXPIRY /
      (60 * 1000);

    const emailPayload = {
      to: user.email,
      subject: 'Reset your password',

      text: [
        `Hi ${
          user.fullName ||
          user.username ||
          'there'
        },`,
        '',
        `Use this link to reset your password: ${resetLink}`,
        '',
        `This link expires in ${expiryMinutes} minutes.`,
        'If you did not request this, you can ignore this email.',
      ].join('\n'),

      html: `
        <p>Hi ${
          user.fullName ||
          user.username ||
          'there'
        },</p>

        <p>Use the link below to reset your password:</p>

        <p>
          <a href="${resetLink}">
            Reset Password
          </a>
        </p>

        <p>
          This link expires in
          ${expiryMinutes} minutes.
        </p>

        <p>
          If you did not request this,
          you can ignore this email.
        </p>
      `,
    };

    if (
      process.env
        .PASSWORD_RESET_EMAIL_WEBHOOK_URL
    ) {
      const emailResponse =
        await fetch(
          process.env
            .PASSWORD_RESET_EMAIL_WEBHOOK_URL,
                  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.PASSWORD_RESET_EMAIL_WEBHOOK_TOKEN && {
            Authorization: `Bearer ${process.env.PASSWORD_RESET_EMAIL_WEBHOOK_TOKEN}`,
          }),
        },
        body: JSON.stringify(emailPayload),
      }
    );

    if (!emailResponse.ok) {
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        'Unable to send password reset email.'
      );
    }
  } else if (process.env.NODE_ENV !== 'production') {
    logger.info(emailPayload);
  }

  return {
    message:
      'If an account exists with this email, a password reset link has been sent.',

    /**
     * Development Only
     */
    resetToken,
  };
}

/**
 * Reset Password
 */
async resetPassword(resetToken, newPassword) {
  const normalizedResetToken =
    typeof resetToken === 'string'
      ? resetToken.trim()
      : '';

  if (!normalizedResetToken) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.TOKEN.INVALID
    );
  }

  const tokenParts =
    normalizedResetToken.split('.');

  if (
    tokenParts.length !== 2 ||
    !tokenParts[0] ||
    !tokenParts[1]
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.TOKEN.INVALID
    );
  }

  const [tokenId, secret] = tokenParts;

  const user =
    await authRepository.findUserByPasswordResetTokenId(
      tokenId
    );

  if (
    !user ||
    !user.passwordResetTokenHash ||
    !user.passwordResetTokenExpires
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.TOKEN.INVALID
    );
  }

  if (
    user.passwordResetTokenExpires.getTime() <=
    Date.now()
  ) {
    await authRepository.clearPasswordResetToken(
      user._id
    );

    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.TOKEN.EXPIRED
    );
  }

  const isValidToken =
    await comparePassword(
      secret,
      user.passwordResetTokenHash
    );

  if (!isValidToken) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.TOKEN.INVALID
    );
  }

  const hashedPassword =
    await hashPassword(newPassword);

  await authRepository.updatePasswordAndClearRefreshToken(
    user._id,
    hashedPassword
  );

  return {
    message:
      AUTH_MESSAGES.PASSWORD.RESET_SUCCESS,
  };
}

/**
 * Change Password
 */
async changePassword(
  userId,
  oldPassword,
  newPassword
) {
    // Find User
  const user =
    await authRepository.findUserByIdWithPassword(
      userId
    );

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.USER.NOT_FOUND
    );
  }

  // Verify Old Password
  const isOldPasswordValid =
    await comparePassword(
      oldPassword,
      user.password
    );

  if (!isOldPasswordValid) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.PASSWORD.INVALID
    );
  }

  // Prevent Same Password
  const isSamePassword =
    await comparePassword(
      newPassword,
      user.password
    );

  if (isSamePassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.PASSWORD.SAME_AS_OLD
    );
  }

  // Hash New Password
  const hashedPassword =
    await hashPassword(newPassword);

  // Update Password
  await authRepository.updatePasswordAndClearRefreshToken(
    userId,
    hashedPassword
  );

  return {
    message:
      AUTH_MESSAGES.PASSWORD.CHANGED,
  };
}

/**
 * Get User Profile
 */
  async getProfile(userId) {
    // Find User
    const user =
      await authRepository.findUserById(
        userId
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        AUTH_MESSAGES.USER.NOT_FOUND
      );
    }

    // Check User Status
    if (user.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        AUTH_MESSAGES.LOGIN.ACCOUNT_INACTIVE
      );
    }

    // Check Role
    if (!user.role) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        AUTH_MESSAGES.ROLE.NOT_FOUND
      );
    }

    if (user.role.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        AUTH_MESSAGES.ROLE.INACTIVE
      );
    }

    return user;
  }

  async checkAdminExists() {
    const adminRole = await authRepository.findRoleByCode('TENANT_ADMIN');
    if (!adminRole) return false;

    const adminCount = await User.countDocuments({
      role: adminRole._id,
      isDeleted: false,
      status: 'ACTIVE',
    });

    return adminCount > 0;
  }
/**
 * Update User Profile
 */
async updateProfile(userId, payload) {
    const {
        fullName,
        mobileNumber,
        username,
    } = payload;

    // Check user exists
    const user =
        await authRepository.findUserById(userId);

    if (!user) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            AUTH_MESSAGES.USER.NOT_FOUND
        );
    }

    // Username uniqueness check
    if (
        username &&
        username !== user.username
    ) {
        const existingUser =
            await authRepository.findByUsername(
                username
            );

        if (
            existingUser &&
            existingUser._id.toString() !==
                userId.toString()
        ) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                AUTH_MESSAGES.USER.USERNAME_ALREADY_EXISTS
            );
        }
    }

    // Prepare update payload
    const updateData = {};

    if (fullName !== undefined) {
        updateData.fullName = fullName;
    }

    if (mobileNumber !== undefined) {
        updateData.mobileNumber =
            mobileNumber;
    }

    if (username !== undefined) {
        updateData.username = username;
    }

    // Update profile
    const updatedUser =
        await authRepository.updateUserById(
            userId,
            updateData
        );

    return updatedUser;
}

}
export default new AuthService();