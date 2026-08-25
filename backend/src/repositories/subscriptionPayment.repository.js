import SubscriptionPayment from '../models/SubscriptionPayment.js';

class SubscriptionPaymentRepository {
  async create(paymentData) {
    return await SubscriptionPayment.create(paymentData);
  }

  async findById(paymentId, tenantId = null) {
    const query = {
      _id: paymentId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await SubscriptionPayment.findOne(query)
      .populate('subscription')
      .populate('createdBy', 'fullName email');
  }

  async findByOrderId(providerOrderId, tenantId = null) {
    const query = {
      providerOrderId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await SubscriptionPayment.findOne(query)
      .populate('tenant', 'companyName')
      .populate('subscription');
  }

  async findByPaymentId(providerPaymentId, tenantId = null) {
    const query = {
      providerPaymentId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await SubscriptionPayment.findOne(query)
      .populate('tenant', 'companyName')
      .populate('subscription');
  }

  async findBySubscription(subscriptionId, options = {}, tenantId = null) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;

    const query = {
      subscription: subscriptionId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await SubscriptionPayment.find(query)
      .populate('tenant', 'companyName')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findByTenant(tenantId, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;

    return await SubscriptionPayment.find({
      tenant: tenantId,
      isDeleted: false,
    })
      .populate('subscription')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async update(paymentId, updateData, tenantId = null, session = null) {
    const query = {
      _id: paymentId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await SubscriptionPayment.findOneAndUpdate(
      query,
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
        ...(session ? { session } : {}),
      }
    );
  }

  async updateByOrderId(providerOrderId, updateData, tenantId = null, session = null) {
    const query = {
      providerOrderId,
      isDeleted: false,
    };

    if (tenantId) {
      query.tenant = tenantId;
    }

    return await SubscriptionPayment.findOneAndUpdate(
      query,
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
        ...(session ? { session } : {}),
      }
    );
  }

  async count(filter, tenantId = null) {
    const query = tenantId ? { ...filter, tenant: tenantId } : filter;

    return await SubscriptionPayment.countDocuments(query);
  }
}

export default new SubscriptionPaymentRepository();
