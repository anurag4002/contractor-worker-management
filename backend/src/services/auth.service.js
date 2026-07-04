import { StatusCodes } from 'http-status-codes';

import authRepository from '../repositories/auth.repository.js';

import ApiError from '../common/errors/ApiError.js';

import { hashPassword } from '../common/utils/password.util.js';

import { generateAccessToken, generateRefreshToken, } from '../common/utils/jwt.util.js';

import {generateAccessToken,generateRefreshToken,verifyRefreshToken,} from '../common/utils/jwt.util.js';

import { comparePassword, hashPassword,} from '../common/utils/password.util.js';

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
}
  
export default new AuthService();