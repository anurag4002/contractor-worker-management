import Tenant from '../models/Tenant.js';

class TenantRepository {
  async create(tenantData) {
    return await Tenant.create(tenantData);
  }

  async findById(tenantId) {
    return await Tenant.findOne({
      _id: tenantId,
      isDeleted: false,
    }).populate({
      path: 'owner',
      select: '_id fullName email mobileNumber',
    });
  }

  async findByEmail(email) {
    return await Tenant.findOne({
      email,
      isDeleted: false,
    });
  }

  async findByOwner(ownerId) {
    return await Tenant.findOne({
      owner: ownerId,
      isDeleted: false,
    }).populate({
      path: 'owner',
      select: '_id fullName email mobileNumber',
    });
  }

  async findAll(filter, options) {
    return await Tenant.find(filter)
      .populate({
        path: 'owner',
        select: '_id fullName email mobileNumber',
      })
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  async count(filter) {
    return await Tenant.countDocuments(filter);
  }

  async update(tenantId, updateData) {
    return await Tenant.findByIdAndUpdate(
      tenantId,
      updateData,
      {
        returnDocument: 'after',
      }
    ).populate({
      path: 'owner',
      select: '_id fullName email mobileNumber',
    });
  }
}

export default new TenantRepository();
