import SubscriptionPlan from '../models/SubscriptionPlan.js';

class SubscriptionPlanRepository {
  async create(planData) {
    return await SubscriptionPlan.create(planData);
  }

  async findById(planId) {
    return await SubscriptionPlan.findOne({
      _id: planId,
      isDeleted: false,
    });
  }

  async findByCode(code) {
    return await SubscriptionPlan.findOne({
      code,
      isDeleted: false,
    });
  }

  async findActivePlans() {
    return await SubscriptionPlan.find({
      status: 'ACTIVE',
      isDeleted: false,
    }).sort({ createdAt: 1 });
  }

  async findAll(filter, options) {
    return await SubscriptionPlan.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  async count(filter) {
    return await SubscriptionPlan.countDocuments(filter);
  }

  async update(planId, updateData) {
    return await SubscriptionPlan.findByIdAndUpdate(
      planId,
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );
  }

  async softDelete(planId) {
    return await SubscriptionPlan.findByIdAndUpdate(
      planId,
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

export default new SubscriptionPlanRepository();
