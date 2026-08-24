import { Router } from 'express';

import tenantController from '../controllers/tenant.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import requireActiveSubscription from '../middlewares/subscription.middleware.js';
import {
  createTenantSchema,
  updateTenantSchema,
  getTenantsQuerySchema,
} from '../validators/tenant.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Tenant
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('TENANT_CREATE'),
  validate(createTenantSchema),
  tenantController.createTenant
);

/*
|--------------------------------------------------------------------------
| Get All Tenants (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('TENANT_READ'),
  validate(getTenantsQuerySchema, 'query'),
  tenantController.getTenants
);

/*
|--------------------------------------------------------------------------
| Get Tenant By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('TENANT_READ'),
  tenantController.getTenantById
);

/*
|--------------------------------------------------------------------------
| Update Tenant
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('TENANT_UPDATE'),
  validate(updateTenantSchema),
  tenantController.updateTenant
);

export default router;
