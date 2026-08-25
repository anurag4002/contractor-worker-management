import Notification from '../models/Notification.js';

class NotificationRepository {
  /**
   * ==========================================
   * Create Notification
   * ==========================================
   */
  async create(payload) {
    return await Notification.create(payload);
  }

  /**
   * ==========================================
   * Find All Notifications
   * ==========================================
   */
  async findAll(filter = {}, cutoffDate = null, tenantId = null) {
    const query = {
      isDeleted: false,
      ...filter,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    if (cutoffDate) {
      query.createdAt = { $gt: cutoffDate };
    }

    return await Notification.find(query)
      .populate(
        'recipient',
        'fullName email'
      )
      .populate(
        'createdBy',
        'fullName email'
      )
      .populate(
        'updatedBy',
        'fullName email'
      )
      .sort({
        createdAt: -1,
      });
  }

  /**
   * ==========================================
   * Find Notification By Id
   * ==========================================
   */
  async findById(id, tenantId = null) {
    const query = {
      _id: id,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Notification.findOne(query)
      .populate(
        'recipient',
        'fullName email'
      )
      .populate(
        'createdBy',
        'fullName email'
      )
      .populate(
        'updatedBy',
        'fullName email'
      );
  }

  /**
   * ==========================================
   * Count Unread Notifications
   * ==========================================
   */
  async countUnread(filter = {}, cutoffDate = null, tenantId = null) {
    const query = {
      isDeleted: false,
      isRead: false,
      ...filter,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    if (cutoffDate) {
      query.createdAt = { $gt: cutoffDate };
    }

    return await Notification.countDocuments(query);
  }

  /**
   * ==========================================
   * Mark Notification As Read
   * ==========================================
   */
  async markAsRead(id, updatedBy, tenantId = null) {
    const query = {
      _id: id,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Notification.findOneAndUpdate(
      query,
      {
        isRead: true,
        updatedBy,
      },
      {
        new: true,
      }
    );
  }

  /**
   * ==========================================
   * Mark All Notifications As Read
   * ==========================================
   */
  async markAllAsRead(
    filter = {},
    updatedBy,
    tenantId = null
  ) {
    const query = {
      isDeleted: false,
      isRead: false,
      ...filter,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Notification.updateMany(
      query,
      {
        $set: {
          isRead: true,
          updatedBy,
        },
      }
    );
  }

  /**
   * ==========================================
   * Soft Delete Notification
   * ==========================================
   */
  async softDelete(id, deletedAt, tenantId = null) {
    const query = {
      _id: id,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Notification.findOneAndUpdate(
      query,
      {
        isDeleted: true,
        deletedAt,
      },
      {
        new: true,
      }
    );
  }

  /**
   * ==========================================
   * Clear All Notifications For User
   * ==========================================
   */
  async clearAll(recipient, deletedAt, tenantId = null) {
    const query = {
      recipient,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Notification.updateMany(
      query,
      {
        $set: {
          isDeleted: true,
          deletedAt,
        },
      }
    );
  }

  /**
   * ==========================================
   * Find Duplicate Subscription Notification
   * ==========================================
   */
  async findDuplicate(category, eventType, recipient, tenantId) {
    const query = {
      category,
      eventType,
      recipient,
      tenant: tenantId,
      isDeleted: false,
    };

    return await Notification.findOne(query);
  }
}

export default new NotificationRepository();
