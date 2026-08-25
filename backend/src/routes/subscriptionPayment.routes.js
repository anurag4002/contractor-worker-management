import { Router } from 'express';

import subscriptionPaymentController from '../controllers/subscriptionPayment.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';

import {
  createPaymentOrderSchema,
  verifyPaymentSchema,
  getPaymentHistoryQuerySchema,
  getSubscriptionPaymentsQuerySchema,
} from '../validators/subscriptionPayment.validator.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Payment Order
|--------------------------------------------------------------------------
*/

router.post(
  '/orders',
  authMiddleware,
  authorize('SUBSCRIPTION_CREATE'),
  validate(createPaymentOrderSchema),
  subscriptionPaymentController.createPaymentOrder
);

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

router.post(
  '/verify',
  authMiddleware,
  authorize('SUBSCRIPTION_CREATE'),
  validate(verifyPaymentSchema),
  subscriptionPaymentController.verifyPayment
);

/*
|--------------------------------------------------------------------------
| Payment Webhook (No auth required - signature verified by provider)
|--------------------------------------------------------------------------
*/

router.post(
  '/webhook',
  subscriptionPaymentController.processWebhook
);

/*
|--------------------------------------------------------------------------
| Get Payment History
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authMiddleware,
  authorize('SUBSCRIPTION_READ'),
  validate(getPaymentHistoryQuerySchema, 'query'),
  subscriptionPaymentController.getPaymentHistory
);

/*
|--------------------------------------------------------------------------
| Get Payment By ID
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  authMiddleware,
  authorize('SUBSCRIPTION_READ'),
  subscriptionPaymentController.getPaymentById
);

/*
|--------------------------------------------------------------------------
| Get Subscription Payments
|--------------------------------------------------------------------------
*/

router.get(
  '/subscription/:subscriptionId',
  authMiddleware,
  authorize('SUBSCRIPTION_READ'),
  validate(getSubscriptionPaymentsQuerySchema, 'query'),
  subscriptionPaymentController.getSubscriptionPayments
);

export default router;
