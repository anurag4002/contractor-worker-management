import { Router } from 'express';

import platformController from '../controllers/platform.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import requireSuperAdmin from '../middlewares/superadmin.middleware.js';
import validate from '../middlewares/validate.middleware.js';

import {
  getPlatformTenantsQuerySchema,
  getPlatformTenantDetailsQuerySchema,
  getPlatformPaymentsQuerySchema,
  getPlatformExpiringSubscriptionsQuerySchema,
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

/*
|--------------------------------------------------------------------------
| Get All Payments (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/payments',
  authMiddleware,
  requireSuperAdmin,
  validate(getPlatformPaymentsQuerySchema, 'query'),
  platformController.getPlatformPayments
);

/*
|--------------------------------------------------------------------------
| Get Payment By ID (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/payments/:paymentId',
  authMiddleware,
  requireSuperAdmin,
  platformController.getPlatformPaymentById
);

/*
|--------------------------------------------------------------------------
| Get Expiring Subscriptions (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/expiring-subscriptions',
  authMiddleware,
  requireSuperAdmin,
  validate(getPlatformExpiringSubscriptionsQuerySchema, 'query'),
  platformController.getPlatformExpiringSubscriptions
);

/*
|--------------------------------------------------------------------------
| Get Recent Users (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/recent-users',
  authMiddleware,
  requireSuperAdmin,
  platformController.getPlatformRecentUsers
);

/*
|--------------------------------------------------------------------------
| Get Recent Payments (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.get(
  '/recent-payments',
  authMiddleware,
  requireSuperAdmin,
  platformController.getPlatformRecentPayments
);

export default router;
