import { StatusCodes } from 'http-status-codes';

import ApiError from '../common/errors/ApiError.js';

import { isSuperAdmin } from '../common/utils/tenant.util.js';

const requireSuperAdmin = (req, res, next) => {
  if (!isSuperAdmin(req)) {
    return next(
      new ApiError(
        StatusCodes.FORBIDDEN,
        'Access denied. SUPER_ADMIN only.'
      )
    );
  }

  next();
};

export default requireSuperAdmin;
