import { StatusCodes } from 'http-status-codes';

import notificationRepository from '../repositories/notification.repository.js';

import userRepository from '../repositories/user.repository.js';

import notificationMessages from '../common/constants/notification.messages.js';

import ApiError from '../common/errors/ApiError.js';

class NotificationService {
    /**
 * ==========================================
 * Create Notification
 * ==========================================
 */
 async createNotification(payload, tenantId) {
   const notification =
     await notificationRepository.create(
       {
         ...payload,
         tenant: tenantId,
       }
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
async getNotifications(filter = {}, userId = null, tenantId = null) {
  let cutoffDate = null;

  if (userId) {
    const user = await userRepository.findById(userId);
    if (user?.notificationsClearedAt) {
      cutoffDate = user.notificationsClearedAt;
    }
  }

  const notifications =
    await notificationRepository.findAll(
      filter,
      cutoffDate,
      tenantId
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
async getNotificationById(id, tenantId) {
  const notification =
    await notificationRepository.findById(
      id,
      tenantId
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
async getUnreadCount(filter = {}, userId = null, tenantId = null) {
  let cutoffDate = null;

  if (userId) {
    const user = await userRepository.findById(userId);
    if (user?.notificationsClearedAt) {
      cutoffDate = user.notificationsClearedAt;
    }
  }

  const count =
    await notificationRepository.countUnread(
      filter,
      cutoffDate,
      tenantId
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
async markAsRead(id, updatedBy, tenantId) {
  const notification =
    await notificationRepository.findById(
      id,
      tenantId
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
      updatedBy,
      tenantId
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
  updatedBy,
  tenantId
) {
  const result =
    await notificationRepository.markAllAsRead(
      filter,
      updatedBy,
      tenantId
    );

  return {
    message:
      notificationMessages.MARKED_READ,
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
  async deleteNotification(id, tenantId) {
    const notification =
      await notificationRepository.findById(
        id,
        tenantId
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
        new Date(),
        tenantId
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

  /**
   * ==========================================
   * Clear All Notifications
   * ==========================================
   */
  async clearAll(userId, tenantId) {
    await userRepository.update(userId, {
      notificationsClearedAt: new Date(),
    });

    await notificationRepository.clearAll(
      userId,
      new Date(),
      tenantId
    );

    return {
      message:
        notificationMessages.CLEARED,
      data: {
        matchedCount: 0,
        modifiedCount: 0,
      },
    };
  }

  /**
   * ==========================================
   * Create Subscription Notification (with duplicate guard)
   * ==========================================
   */
  async createSubscriptionNotification(
    payload,
    tenantId
  ) {
    const {
      category,
      eventType,
      title,
      message,
      type = 'INFO',
      recipient,
      status = 'ACTIVE',
    } = payload;

    if (!category || !eventType || !recipient) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Category, eventType, and recipient are required for subscription notifications.'
      );
    }

    const existing =
      await notificationRepository.findDuplicate(
        category,
        eventType,
        recipient,
        tenantId
      );

    if (existing) {
      return {
        message: notificationMessages.CREATED,
        data: existing,
      };
    }

    const notification =
      await notificationRepository.create({
        category,
        eventType,
        title,
        message,
        type,
        recipient,
        status,
        tenant: tenantId,
      });

    return {
      message:
        notificationMessages.CREATED,
      data: notification,
    };
  }
};
export default new NotificationService();