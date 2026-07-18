import { StatusCodes } from 'http-status-codes';

import notificationRepository from '../repositories/notification.repository.js';

import notificationMessages from '../common/constants/notification.messages.js';

import ApiError from '../common/errors/ApiError.js';

class NotificationService {
    /**
 * ==========================================
 * Create Notification
 * ==========================================
 */
async createNotification(payload) {
  const notification =
    await notificationRepository.create(
      payload
    );

  if (!notification) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      notificationMessages.CREATE_FAILED
    );
  }

  return {
    message:
      notificationMessages.CREATED,
    data: notification,
  };
}
/**
 * ==========================================
 * Get Notifications
 * ==========================================
 */
async getNotifications(filter = {}) {
  const notifications =
    await notificationRepository.findAll(
      filter
    );

  return {
    message:
      notificationMessages.FETCHED,
    data: notifications,
  };
}
/**
 * ==========================================
 * Get Notification By Id
 * ==========================================
 */
async getNotificationById(id) {
  const notification =
    await notificationRepository.findById(
      id
    );

  if (!notification) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      notificationMessages.NOT_FOUND
    );
  }

  return {
    message:
      notificationMessages.FETCHED_ONE,
    data: notification,
  };
}
/**
 * ==========================================
 * Get Unread Notification Count
 * ==========================================
 */
async getUnreadCount(filter = {}) {
  const count =
    await notificationRepository.countUnread(
      filter
    );

  return {
    message:
      notificationMessages.FETCHED,
    data: {
      unreadCount: count,
    },
  };
}
/**
 * ==========================================
 * Mark Notification As Read
 * ==========================================
 */
async markAsRead(id, updatedBy) {
  const notification =
    await notificationRepository.findById(
      id
    );

  if (!notification) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      notificationMessages.NOT_FOUND
    );
  }

  const updatedNotification =
    await notificationRepository.markAsRead(
      id,
      updatedBy
    );

  if (!updatedNotification) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      notificationMessages.MARK_READ_FAILED
    );
  }

  return {
    message:
      notificationMessages.MARKED_READ,
    data: updatedNotification,
  };
}
/**
 * ==========================================
 * Mark All Notifications As Read
 * ==========================================
 */
async markAllAsRead(
  filter = {},
  updatedBy
) {
  const result =
    await notificationRepository.markAllAsRead(
      filter,
      updatedBy
    );

  return {
    message:
      notificationMessages.MARKED_ALL_READ,
    data: {
      matchedCount:
        result.matchedCount,
      modifiedCount:
        result.modifiedCount,
    },
  };
}
/**
 * ==========================================
 * Delete Notification
 * ==========================================
 */
async deleteNotification(id) {
  const notification =
    await notificationRepository.findById(
      id
    );

  if (!notification) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      notificationMessages.NOT_FOUND
    );
  }

  const deletedNotification =
    await notificationRepository.softDelete(
      id,
      new Date()
    );

  if (!deletedNotification) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      notificationMessages.DELETE_FAILED
    );
  }

  return {
    message:
      notificationMessages.DELETED,
    data: deletedNotification,
  };
}
};
export default new NotificationService();