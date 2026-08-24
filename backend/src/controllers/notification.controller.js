import notificationService from '../services/notification.service.js';

import asyncHandler from '../common/helpers/asyncHandler.js';

import ApiResponse from '../common/helpers/ApiResponse.js';

/**
 * ==========================================
 * Create Notification
 * ==========================================
 */
const createNotification =
  asyncHandler(async (req, res) => {
    const result =
      await notificationService.createNotification({
        ...req.body,
        createdBy: req.user._id,
      }, req.user.tenantId);

    return ApiResponse.success(
  res,
  result.data,
  result.message,
  result.statusCode
);
  });

/**
 * ==========================================
 * Get Notifications
 * ==========================================
 */
const getNotifications =
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.recipient) {
      filter.recipient =
        req.query.recipient;
    }

    if (req.query.isRead !== undefined) {
      filter.isRead =
        req.query.isRead === 'true';
    }

    const result =
      await notificationService.getNotifications(
        filter,
        req.user._id,
        req.user.tenantId
      );

   return ApiResponse.success(
   res,
   result.data,
   result.message,
   result.statusCode
 );
  });

/**
 * ==========================================
 * Get Notification By Id
 * ==========================================
 */
const getNotificationById =
  asyncHandler(async (req, res) => {
    const result =
      await notificationService.getNotificationById(
        req.params.id,
        req.user.tenantId
      );

    return ApiResponse.success(
   res,
   result.data,
   result.message,
   result.statusCode
 );
  });

/**
 * ==========================================
 * Get Unread Count
 * ==========================================
 */
const getUnreadCount =
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.recipient) {
      filter.recipient =
        req.query.recipient;
    }

    const result =
      await notificationService.getUnreadCount(
        filter,
        req.user._id,
        req.user.tenantId
      );

   return ApiResponse.success(
   res,
   result.data,
   result.message,
   result.statusCode
 );
  });

/**
 * ==========================================
 * Mark Notification As Read
 * ==========================================
 */
const markAsRead =
  asyncHandler(async (req, res) => {
    const result =
      await notificationService.markAsRead(
        req.params.id,
        req.user._id,
        req.user.tenantId
      );

   return ApiResponse.success(
   res,
   result.data,
   result.message,
   result.statusCode
 );
  });

/**
 * ==========================================
 * Mark All Notifications As Read
 * ==========================================
 */
const markAllAsRead =
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.recipient) {
      filter.recipient =
        req.query.recipient;
    }

    const result =
      await notificationService.markAllAsRead(
        filter,
        req.user._id,
        req.user.tenantId
      );

   return ApiResponse.success(
   res,
   result.data,
   result.message,
   result.statusCode
 );
  });

/**
 * ==========================================
 * Delete Notification
 * ==========================================
 */
  const deleteNotification =
   asyncHandler(async (req, res) => {
     const result =
       await notificationService.deleteNotification(
         req.params.id,
         req.user.tenantId
       );

     return ApiResponse.success(
     res,
     result.data,
     result.message,
     result.statusCode
   );
   });

 /**
  * ==========================================
  * Clear All Notifications
  * ==========================================
  */
  const clearAllNotifications =
   asyncHandler(async (req, res) => {
     const result =
       await notificationService.clearAll(
         req.user._id,
         req.user.tenantId
       );

     return ApiResponse.success(
     res,
     result.data,
     result.message,
     result.statusCode
   );
   });

export default {
  createNotification,
  getNotifications,
  getNotificationById,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};