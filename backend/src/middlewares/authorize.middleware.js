import { StatusCodes } from 'http-status-codes';

import ApiError from '../common/errors/ApiError.js';
import AUTH_MESSAGES from '../common/constants/auth.messages.js';

const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(
          StatusCodes.UNAUTHORIZED,
          AUTH_MESSAGES.UNAUTHORIZED
        )
      );
    }

    const userPermissions = (req.user.permissions || []).map(
      (permission) =>
        typeof permission === 'string'
          ? permission
          : permission.code
    );

    const hasPermission = requiredPermissions.every(
      (permission) => userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(
        new ApiError(
          StatusCodes.FORBIDDEN,
          AUTH_MESSAGES.FORBIDDEN
        )
      );
    }

    next();
  };
};

export default authorize;