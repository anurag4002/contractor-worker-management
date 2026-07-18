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
  async findAll(filter = {}) {
    return await Notification.find({
      isDeleted: false,
      ...filter,
    })
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
  async findById(id) {
    return await Notification.findOne({
      _id: id,
      isDeleted: false,
    })
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
  async countUnread(filter = {}) {
    return await Notification.countDocuments({
      isDeleted: false,
      isRead: false,
      ...filter,
    });
  }

  /**
   * ==========================================
   * Mark Notification As Read
   * ==========================================
   */
  async markAsRead(id, updatedBy) {
    return await Notification.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
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
    updatedBy
  ) {
    return await Notification.updateMany(
      {
        isDeleted: false,
        isRead: false,
        ...filter,
      },
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
  async softDelete(id, deletedAt) {
    return await Notification.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt,
      },
      {
        new: true,
      }
    );
  }
}

export default new NotificationRepository();