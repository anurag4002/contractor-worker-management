import { Router } from 'express';

import notificationController from '../controllers/notification.controller.js';

import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';

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
  authorize('NOTIFICATION_UPDATE'),
  validate(notificationQuerySchema, 'query'),
  notificationController.markAllAsRead
);

/**
 * =========================================
 * Delete Notification
 * =========================================
 */
router.delete(
  '/:id',
  authMiddleware,
  authorize('NOTIFICATION_DELETE'),
  validate(notificationIdSchema, 'params'),
  notificationController.deleteNotification
);

export default router;