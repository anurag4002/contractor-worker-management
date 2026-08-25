import Subscription from '../models/Subscription.js';

class SubscriptionRepository {
  async create(subscriptionData) {
    return await Subscription.create(subscriptionData);
  }

  async findById(subscriptionId, tenantId = null) {
    const query = {
      _id: subscriptionId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Subscription.findOne(query)
      .populate('plan');
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

  async findAll(filter, options, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Subscription.find(query)
      .populate('tenant')
      .populate('plan')
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  async count(filter, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await Subscription.countDocuments(query);
  }

  async findExpiredSubscriptions(now, options = {}) {
    const filter = {
      isDeleted: false,
      endDate: { $lt: now },
      status: { $nin: ['EXPIRED', 'CANCELLED', 'SUSPENDED'] },
    };

    return await Subscription.find(filter)
      .populate('tenant')
      .populate('plan')
      .sort(options.sort || { endDate: 1 })
      .skip(options.skip || 0)
      .limit(options.limit || 1000);
  }

  async update(subscriptionId, updateData, tenantId = null) {
    const query = {
      _id: subscriptionId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Subscription.findOneAndUpdate(
      query,
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );
  }

  async softDelete(subscriptionId, tenantId = null) {
    const query = {
      _id: subscriptionId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await Subscription.findOneAndUpdate(
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

export default new SubscriptionRepository();
