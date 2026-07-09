import { StatusCodes } from 'http-status-codes';

import authRepository from '../repositories/auth.repository.js';

import ApiError from '../common/errors/ApiError.js';

import logger from '../common/logger/logger.js';

import { generateAccessToken, generateRefreshToken, verifyRefreshToken, } from '../common/utils/jwt.util.js';

import { comparePassword, hashPassword, } from '../common/utils/password.util.js';

import { v4 as uuidv4 } from 'uuid';

import { generateRandomToken } from '../common/utils/token.util.js';

import AUTH_CONSTANTS from '../common/constants/auth.constants.js';

class AuthService {
  /**
   * Register User
   */
  async register(registerData) {
    const {
      fullName,
      email,
      mobileNumber,
      username,
      password,
      role,
    } = registerData;

    // Check email
    const existingEmail = await authRepository.findByEmail(email);

    if (existingEmail) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Email already exists.'
      );
    }

    // Check mobile
    const existingMobile =
      await authRepository.findByMobileNumber(mobileNumber);

    if (existingMobile) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Mobile number already exists.'
      );
    }

    // Check username
    const existingUsername =
      await authRepository.findByUsername(username);

    if (existingUsername) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Username already exists.'
      );
    }

    // Check role
    const existingRole =
      await authRepository.findRoleById(role);

    if (!existingRole) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Role not found.'
      );
    }

    // Hash password
    const hashedPassword =
      await hashPassword(password);

    // Create user
    const createdUser =
      await authRepository.create({
        fullName,
        email,
        mobileNumber,
        username,
        password: hashedPassword,
        role,
      });

    // Fetch user without password
    const user =
      await authRepository.findById(createdUser._id);

    return user;
  }

  /**
 * Login User
 */
  async login(loginData) {
    const { email, password } = loginData;

    // Find user by email
    const user = await authRepository.findByEmail(email);

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

    // ---------- PART 2 STARTS HERE ----------'
    // Compare password
    const isPasswordMatched = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      // Increment failed login attempts
      const updatedUser =
        await authRepository.incrementFailedLoginAttempts(user._id);

      // Lock account if maximum attempts reached
      if (
        updatedUser.failedLoginAttempts >=
        AUTH_CONSTANTS.MAX_LOGIN_ATTEMPTS
      ) {
        const lockUntil = new Date(
          Date.now() + AUTH_CONSTANTS.ACCOUNT_LOCK_DURATION
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
    await authRepository.resetFailedLoginAttempts(user._id);

    // ---------- PART 3 STARTS HERE ----------
    // Prepare JWT payload
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role._id,
    };

    // Generate JWT Tokens
    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    // Save Refresh Token
    const hashedRefreshToken = await hashPassword(refreshToken);

    await authRepository.saveRefreshToken(
      user._id,
      hashedRefreshToken
    );

    // Update Last Login
    await authRepository.updateLastLogin(user._id);

    // Fetch Updated User (without password & refresh token)
    const loggedInUser =
      await authRepository.findUserById(user._id);

    // Return Response
    return {
      user: loggedInUser,
      accessToken,
      refreshToken,
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

    // Verify JWT
    const decoded = verifyRefreshToken(refreshToken);

    // Find User
    const user = await authRepository.findUserById(decoded.userId);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        AUTH_MESSAGES.USER.NOT_FOUND
      );
    }

    // Compare Refresh Token
    const isTokenValid = await comparePassword(
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
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role._id,
    };

    // Generate New Tokens
    const newAccessToken =
      generateAccessToken(payload);

    const newRefreshToken =
      generateRefreshToken(payload);

    // Hash Refresh Token
    const hashedRefreshToken =
      await hashPassword(newRefreshToken);

    // Save New Refresh Token Hash
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
    const user = await authRepository.findUserByEmail(email);

    /**
     * Never reveal whether an account exists
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
    const secret = generateRandomToken(32);

    // Hash Secret
    const hashedSecret =
      await hashPassword(secret);

    // Expiry
    const expiresAt = new Date(
      Date.now() +
      AUTH_CONSTANTS.PASSWORD_RESET_TOKEN_EXPIRY
    );

    // Save Token
    await authRepository.savePasswordResetToken(
      user._id,
      tokenId,
      hashedSecret,
      expiresAt
    );

    /**
     * Final Reset Token
     *
     * tokenId.secret
     */
    const resetToken =
      `${tokenId}.${secret}`;

    const resetUrl = new URL(
      '/reset-password',
      process.env.FRONTEND_URL || 'http://localhost:5173'
    );
    resetUrl.searchParams.set('token', resetToken);

    const resetLink = resetUrl.toString();
    const expiryMinutes =
      AUTH_CONSTANTS.PASSWORD_RESET_TOKEN_EXPIRY / (60 * 1000);
    const emailPayload = {
      to: user.email,
      subject: 'Reset your password',
      text: [
        `Hi ${user.fullName || user.username || 'there'},`,
        '',
        `Use this link to reset your password: ${resetLink}`,
        '',
        `This link expires in ${expiryMinutes} minutes.`,
        'If you did not request this, you can ignore this email.',
      ].join('\n'),
      html: `
      <p>Hi ${user.fullName || user.username || 'there'},</p>
      <p>Use the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset password</a></p>
      <p>This link expires in ${expiryMinutes} minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
    };

    if (process.env.PASSWORD_RESET_EMAIL_WEBHOOK_URL) {
      const emailResponse = await fetch(
        process.env.PASSWORD_RESET_EMAIL_WEBHOOK_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.PASSWORD_RESET_EMAIL_WEBHOOK_TOKEN && {
              Authorization:
                `Bearer ${process.env.PASSWORD_RESET_EMAIL_WEBHOOK_TOKEN}`,
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
    // Validate reset token
    if (!resetToken) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        AUTH_MESSAGES.TOKEN.INVALID
      );
    }

    // Split token (tokenId.secret)
    const tokenParts = resetToken.split('.');

    if (tokenParts.length !== 2) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        AUTH_MESSAGES.TOKEN.INVALID
      );
    }

    const [tokenId, secret] = tokenParts;

    // Find user
    const user =
      await authRepository.findUserByPasswordResetTokenId(
        tokenId
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        AUTH_MESSAGES.TOKEN.INVALID
      );
    }

    // Compare secret
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

    // Hash new password
    const hashedPassword =
      await hashPassword(newPassword);

    // Update password
    await authRepository.updatePassword(
      user._id,
      hashedPassword
    );

    // Clear reset token & refresh token
    await authRepository.clearPasswordResetToken(
      user._id
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
      await authRepository.findUserByIdWithPassword(userId);;

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
  const user = await authRepository.findUserById(userId);

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
}

export default new AuthService();
