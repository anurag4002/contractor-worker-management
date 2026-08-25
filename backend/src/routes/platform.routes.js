import { Router } from 'express';

import platformController from '../controllers/platform.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import requireSuperAdmin from '../middlewares/superadmin.middleware.js';
import validate from '../middlewares/validate.middleware.js';

import {
  getPlatformTenantsQuerySchema,
  getPlatformTenantDetailsQuerySchema,
} from '../validators/platform.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Platform Dashboard (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/dashboard',
  authMiddleware,
  requireSuperAdmin,
  platformController.getPlatformDashboard
);

/*
|--------------------------------------------------------------------------
| Get All Tenants / Contractors (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/tenants',
  authMiddleware,
  requireSuperAdmin,
  validate(getPlatformTenantsQuerySchema, 'query'),
  platformController.getPlatformTenants
);

/*
|--------------------------------------------------------------------------
| Get Tenant Details (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/tenants/:tenantId',
  authMiddleware,
  requireSuperAdmin,
  validate(getPlatformTenantDetailsQuerySchema, 'params'),
  platformController.getPlatformTenantDetails
);

/*
|--------------------------------------------------------------------------
| Get Tenant Subscription (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/tenants/:tenantId/subscription',
  authMiddleware,
  requireSuperAdmin,
  platformController.getPlatformTenantSubscription
);

export default router;
