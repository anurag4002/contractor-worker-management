import { StatusCodes } from 'http-status-codes';

import authRepository from '../repositories/auth.repository.js';

import { verifyAccessToken } from '../common/utils/jwt.util.js';

import ApiError from '../common/errors/ApiError.js';

import AUTH_MESSAGES from '../common/constants/auth.messages.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

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

    const decoded = verifyAccessToken(token);

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