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
  async findByEmail(email, tenantId = null) {
    const query = {
      email,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await User.findOne(query)
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
  async findByMobileNumber(mobileNumber, tenantId = null) {
    const query = {
      mobileNumber,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await User.findOne(query)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      });
  }

  /**
   * ===============================
   * Find By Username
   * ===============================
   */
  async findByUsername(username, tenantId = null) {
    const query = {
      username,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await User.findOne(query)
      .populate({
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
  async findById(userId, tenantId = null) {
    const query = {
      _id: userId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await User.findOne(query)
      .populate({
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
  async findAll(filter, options, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await User.find(query)
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
  async count(filter, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await User.countDocuments(query);
  }

  /**
   * ===============================
   * Update User
   * ===============================
   */
  async update(userId, updateData, tenantId = null) {
    const query = {
      _id: userId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await User.findOneAndUpdate(
      query,
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
  async updateStatus(userId, status, tenantId = null) {
    const query = {
      _id: userId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await User.findOneAndUpdate(
      query,
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
  async softDelete(userId, tenantId = null) {
    const query = {
      _id: userId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await User.findOneAndUpdate(
      query,
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
