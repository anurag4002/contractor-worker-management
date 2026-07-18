import Role from '../models/Role.js';

class RoleRepository {
  /**
   * Create Role
   */
  async create(roleData) {
    return await Role.create(roleData);
  }

  /**
   * Find Role By Id
   */
  async findById(roleId) {
    return await Role.findOne({
      _id: roleId,
      isDeleted: false,
    }).populate('permissions');
  }

  /**
   * Find Role By Name
   */
  async findByName(name) {
    return await Role.findOne({
      name,
      isDeleted: false,
    });
  }

  /**
   * Find Role By Code
   */
  async findByCode(code) {
    return await Role.findOne({
      code,
      isDeleted: false,
    });
  }

  /**
   * Get Roles
   */
  async findAll(filter, options) {
    return await Role.find(filter)
      .populate('permissions')
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  /**
   * Count Roles
   */
  async count(filter) {
    return await Role.countDocuments(filter);
  }

  /**
   * Update Role
   */
  async update(roleId, updateData) {
    return await Role.findOneAndUpdate(
      {
        _id: roleId,
        isDeleted: false,
      },
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    ).populate('permissions');
  }

  /**
   * Change Status
   */
  async changeStatus(roleId, status) {
    return await Role.findOneAndUpdate(
      {
        _id: roleId,
        isDeleted: false,
      },
      {
        status,
      },
      {
        returnDocument: 'after',
      }
    ).populate('permissions');
  }

  /**
   * Soft Delete
   */
  async softDelete(roleId) {
    return await Role.findOneAndUpdate(
      {
        _id: roleId,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        returnDocument: 'after',
      }
    );
  }
}

export default new RoleRepository();