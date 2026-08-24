import { StatusCodes } from 'http-status-codes';

import ApiError from '../errors/ApiError.js';

import {
  getTenantId,
  isSuperAdmin,
} from '../utils/tenant.util.js';

const tenantMiddleware = () => {
  return (req, res, next) => {
    try {
      const tenantId = getTenantId(req);

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
