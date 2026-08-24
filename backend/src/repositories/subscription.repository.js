import Subscription from '../models/Subscription.js';

class SubscriptionRepository {
  async create(subscriptionData) {
    return await Subscription.create(subscriptionData);
  }

  async findById(subscriptionId) {
    return await Subscription.findOne({
      _id: subscriptionId,
      isDeleted: false,
    }).populate('plan');
  }

  async findByTenant(tenantId) {
    return await Subscription.findOne({
      tenant: tenantId,
      isDeleted: false,
    }).populate('plan');
  }

  async findActiveByTenant(tenantId) {
    return await Subscription.findOne({
      tenant: tenantId,
      status: 'ACTIVE',
      isDeleted: false,
    }).populate('plan');
  }

  async findAll(filter, options) {
    return await Subscription.find(filter)
      .populate('tenant')
      .populate('plan')
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  async count(filter) {
    return await Subscription.countDocuments(filter);
  }

  async update(subscriptionId, updateData) {
    return await Subscription.findByIdAndUpdate(
      subscriptionId,
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );
  }

  async softDelete(subscriptionId) {
    return await Subscription.findByIdAndUpdate(
      subscriptionId,
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

export default new SubscriptionRepository();
