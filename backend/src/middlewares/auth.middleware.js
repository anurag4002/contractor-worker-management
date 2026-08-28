import { StatusCodes } from 'http-status-codes';

import authRepository from '../repositories/auth.repository.js';

import { verifyAccessToken } from '../common/utils/jwt.util.js';

import ApiError from '../common/errors/ApiError.js';

import AUTH_MESSAGES from '../common/constants/auth.messages.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    console.info('[AUTH DEBUG]', {
      method: req.method,
      path: req.originalUrl,
      hasAuthorizationHeader: !!authorization,
      scheme: authorization ? authorization.split(' ')[0] : null,
      tokenLength: authorization ? authorization.split(' ')[1]?.length || 0 : 0,
    });

    if (!authorization) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.TOKEN.INVALID
      );
    }

    if (!authorization.startsWith('Bearer ')) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.TOKEN.INVALID
      );
    }

    const token = authorization.split(' ')[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      console.error('[AUTH DEBUG] JWT verification failed', {
        method: req.method,
        path: req.originalUrl,
        jwtError: error.name,
        jwtMessage: error.message,
      });
      throw error;
    }

    const user = await authRepository.findUserById(
      decoded.userId
    );

    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.USER.NOT_FOUND
      );
    }

    if (user.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        AUTH_MESSAGES.LOGIN.ACCOUNT_INACTIVE
      );
    }

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

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role.code,
      tenantId: user.tenant ? (user.tenant._id || user.tenant) : null,
      permissions:
        user.role.permissions?.map(
          (permission) => permission.code
        ) || [],
    };
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;