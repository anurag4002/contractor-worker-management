import { StatusCodes } from 'http-status-codes';

import ApiError from '../common/errors/ApiError.js';

import { isSuperAdmin } from '../common/utils/tenant.util.js';

const tenantMiddleware = () => {
  return (req, res, next) => {
    try {
      const tenantId = req.user?.tenantId || null;

      if (!tenantId && !isSuperAdmin(req)) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          'Tenant context is required.'
        );
      }

      req.tenantId = tenantId;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default tenantMiddleware;
