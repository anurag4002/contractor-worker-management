import { Router } from 'express';

import subscriptionController from '../controllers/subscription.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';

import {
  createSubscriptionSchema,
  getSubscriptionQuerySchema,
  getCurrentSubscriptionQuerySchema,
  updateSubscriptionStatusSchema,
  getSubscriptionsQuerySchema,
} from '../validators/subscription.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Subscription
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  authMiddleware,
  authorize('SUBSCRIPTION_CREATE'),
  validate(createSubscriptionSchema),
  subscriptionController.createSubscription
);

/*
|--------------------------------------------------------------------------
| Get Subscription for a Tenant
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  authorize('SUBSCRIPTION_READ'),
  validate(getSubscriptionQuerySchema, 'query'),
  subscriptionController.getSubscription
);

/*
|--------------------------------------------------------------------------
| Get All Subscriptions (SUPER_ADMIN)
|--------------------------------------------------------------------------
*/

router.get(
  '/all',
  authMiddleware,
  authorize('SUBSCRIPTION_READ_ALL'),
  validate(getSubscriptionsQuerySchema, 'query'),
  subscriptionController.getSubscriptions
);

/*
|--------------------------------------------------------------------------
| Get Current Subscription
|--------------------------------------------------------------------------
*/

router.get(
  '/current',
  authMiddleware,
  authorize('SUBSCRIPTION_READ'),
  validate(getCurrentSubscriptionQuerySchema, 'query'),
  subscriptionController.getCurrentSubscription
);

/*
|--------------------------------------------------------------------------
| Update Subscription Status
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/status',
  authMiddleware,
  authorize('SUBSCRIPTION_UPDATE'),
  validate(updateSubscriptionStatusSchema),
  subscriptionController.updateSubscriptionStatus
);

/*
|--------------------------------------------------------------------------
| Cancel Subscription
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/cancel',
  authMiddleware,
  authorize('SUBSCRIPTION_UPDATE'),
  subscriptionController.cancelSubscription
);

export default router;
