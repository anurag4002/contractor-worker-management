import User from '../models/User.js';

class UserRepository {
  /**
   * ===============================
   * Create User
   * ===============================
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * ===============================
   * Find By Email
   * ===============================
   */
  async findByEmail(email) {
    return await User.findOne({
      email,
      isDeleted: false,
    })
      .select('+password')
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      });
  }

  /**
   * ===============================
   * Find By Mobile Number
   * ===============================
   */
  async findByMobileNumber(mobileNumber) {
    return await User.findOne({
      mobileNumber,
      isDeleted: false,
    }).populate({
      path: 'role',
      populate: {
        path: 'permissions',
      },
    });
  }

  /**
   * ===============================
   * Find By Id
   * ===============================
   */
  async findById(userId) {
    return await User.findOne({
      _id: userId,
      isDeleted: false,
    }).populate({
      path: 'role',
      populate: {
        path: 'permissions',
      },
    });
  }

  /**
   * ===============================
   * Get Users
   * ===============================
   */
  async findAll(filter, options) {
    return await User.find(filter)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      })
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * ===============================
   * Count Users
   * ===============================
   */
  async count(filter) {
    return await User.countDocuments(filter);
  }

  /**
   * ===============================
   * Update User
   * ===============================
   */
  async update(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        returnDocument: 'after',
      }
    ).populate({
      path: 'role',
      populate: {
        path: 'permissions',
      },
    });
  }

  /**
   * ===============================
   * Change Status
   * ===============================
   */
  async updateStatus(userId, status) {
    return await User.findByIdAndUpdate(
      userId,
      {
        status,
      },
      {
        returnDocument: 'after',
      }
    ).populate({
      path: 'role',
      populate: {
        path: 'permissions',
      },
    });
  }

  /**
   * ===============================
   * Soft Delete User
   * ===============================
   */
  async softDelete(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        returnDocument: 'after',
      }
    );
  }
}

export default new UserRepository();