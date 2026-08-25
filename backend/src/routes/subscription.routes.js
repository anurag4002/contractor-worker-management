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
  renewSubscriptionSchema,
  suspendSubscriptionSchema,
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

/*
|--------------------------------------------------------------------------
| Renew Subscription
|--------------------------------------------------------------------------
*/

router.post(
  '/renew',
  authMiddleware,
  authorize('SUBSCRIPTION_CREATE'),
  validate(renewSubscriptionSchema),
  subscriptionController.renewSubscription
);

/*
|--------------------------------------------------------------------------
| Suspend Subscription
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/suspend',
  authMiddleware,
  authorize('SUBSCRIPTION_UPDATE'),
  validate(suspendSubscriptionSchema),
  subscriptionController.suspendSubscription
);

/*
|--------------------------------------------------------------------------
| Check and Expire Subscriptions (Admin/Cron)
|--------------------------------------------------------------------------
*/

router.post(
  '/renewals/check',
  authMiddleware,
  authorize('SUBSCRIPTION_UPDATE'),
  subscriptionController.checkExpiredSubscriptions
);

/*
|--------------------------------------------------------------------------
| Check and Send Trial Reminders (Admin/Cron)
|--------------------------------------------------------------------------
*/

router.post(
  '/trials/reminders/check',
  authMiddleware,
  authorize('SUBSCRIPTION_UPDATE'),
  subscriptionController.checkTrialReminders
);

export default router;
