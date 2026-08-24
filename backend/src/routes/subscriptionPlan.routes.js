import { Router } from 'express';

import subscriptionPlanController from '../controllers/subscriptionPlan.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';

import {
  createSubscriptionPlanSchema,
  updateSubscriptionPlanSchema,
  getSubscriptionPlansQuerySchema,
} from '../validators/subscriptionPlan.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Subscription Plan (SUPER_ADMIN only)
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  authorize('SUBSCRIPTION_PLAN_CREATE'),
  validate(createSubscriptionPlanSchema),
  subscriptionPlanController.createSubscriptionPlan
);

/*
|--------------------------------------------------------------------------
| Get All Subscription Plans
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  authorize('SUBSCRIPTION_PLAN_READ'),
  validate(getSubscriptionPlansQuerySchema, 'query'),
  subscriptionPlanController.getSubscriptionPlans
);

/*
|--------------------------------------------------------------------------
| Get Subscription Plan By Id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  authorize('SUBSCRIPTION_PLAN_READ'),
  subscriptionPlanController.getSubscriptionPlanById
);

/*
|--------------------------------------------------------------------------
| Get Subscription Plan By Code
|--------------------------------------------------------------------------
*/

router.get(
  '/code/:code',
  authMiddleware,
  authorize('SUBSCRIPTION_PLAN_READ'),
  subscriptionPlanController.getSubscriptionPlanByCode
);

/*
|--------------------------------------------------------------------------
| Update Subscription Plan
|--------------------------------------------------------------------------
*/

router.put(
  '/:id',
  authMiddleware,
  authorize('SUBSCRIPTION_PLAN_UPDATE'),
  validate(updateSubscriptionPlanSchema),
  subscriptionPlanController.updateSubscriptionPlan
);

/*
|--------------------------------------------------------------------------
| Delete Subscription Plan
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  authMiddleware,
  authorize('SUBSCRIPTION_PLAN_DELETE'),
  subscriptionPlanController.deleteSubscriptionPlan
);

export default router;
