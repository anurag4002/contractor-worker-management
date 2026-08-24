import { Router } from 'express';

import notificationController from '../controllers/notification.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import requireActiveSubscription from '../middlewares/subscription.middleware.js';

import {
  createNotificationSchema,
  notificationIdSchema,
  notificationQuerySchema,
} from '../validators/notification.validator.js';

const router = Router();

/**
 * =========================================
 * Create Notification
 * =========================================
 */
router.post(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('NOTIFICATION_CREATE'),
  validate(createNotificationSchema, 'body'),
  notificationController.createNotification
);

/**
 * =========================================
 * Get All Notifications
 * =========================================
 */
router.get(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('NOTIFICATION_READ'),
  validate(notificationQuerySchema, 'query'),
  notificationController.getNotifications
);

/**
 * =========================================
 * Get Unread Notification Count
 * =========================================
 */
router.get(
  '/unread-count',
  authMiddleware,
  requireActiveSubscription,
  authorize('NOTIFICATION_READ'),
  validate(notificationQuerySchema, 'query'),
  notificationController.getUnreadCount
);

/**
 * =========================================
 * Get Notification By ID
 * =========================================
 */
router.get(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('NOTIFICATION_READ'),
  validate(notificationIdSchema, 'params'),
  notificationController.getNotificationById
);

/**
 * =========================================
 * Mark Notification As Read
 * =========================================
 */
router.patch(
  '/:id/read',
  authMiddleware,
  requireActiveSubscription,
  authorize('NOTIFICATION_UPDATE'),
  validate(notificationIdSchema, 'params'),
  notificationController.markAsRead
);

/**
 * =========================================
 * Mark All Notifications As Read
 * =========================================
 */
router.patch(
  '/read-all',
  authMiddleware,
  requireActiveSubscription,
  authorize('NOTIFICATION_UPDATE'),
  validate(notificationQuerySchema, 'query'),
  notificationController.markAllAsRead
);

/**
 * =========================================
 * Clear All Notifications
 * =========================================
 */
router.delete(
  '/',
  authMiddleware,
  requireActiveSubscription,
  authorize('NOTIFICATION_DELETE'),
  notificationController.clearAllNotifications
);

/**
 * =========================================
 * Delete Notification
 * =========================================
 */
router.delete(
  '/:id',
  authMiddleware,
  requireActiveSubscription,
  authorize('NOTIFICATION_DELETE'),
  validate(notificationIdSchema, 'params'),
  notificationController.deleteNotification
);

export default router;