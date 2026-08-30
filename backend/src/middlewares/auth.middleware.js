import { StatusCodes } from 'http-status-codes';

import authRepository from '../repositories/auth.repository.js';

import { verifyAccessToken } from '../common/utils/jwt.util.js';

import ApiError from '../common/errors/ApiError.js';

import AUTH_MESSAGES from '../common/constants/auth.messages.js';

import logger from '../common/logger/logger.js';

import Role from '../models/Role.js';

import Permission from '../models/Permission.js';

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

    if (
      user.role.code === 'TENANT_ADMIN' &&
      (!user.role.permissions || user.role.permissions.length === 0)
    ) {
      const allPermissions = await Permission.find({
        isDeleted: false,
        status: 'ACTIVE',
      });

      if (allPermissions.length > 0) {
        await Role.findByIdAndUpdate(user.role._id, {
          permissions: allPermissions.map((permission) => permission._id),
        });

        logger.warn('TENANT_ADMIN role had no permissions. Auto-repaired.', {
          userId: user._id,
          roleId: user.role._id,
          permissionCount: allPermissions.length,
        });
      }
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