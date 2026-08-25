import Tenant from '../models/Tenant.js';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import User from '../models/User.js';

class PlatformRepository {
  async getDashboardStats() {
    const tenants = await Tenant.find({ isDeleted: false }).select('_id');

    const tenantIds = tenants.map((tenant) => tenant._id);

    const subscriptions = await Subscription.find({
      tenant: { $in: tenantIds },
      isDeleted: false,
    }).populate('plan');

    const totalContractors = tenants.length;

    const activeTrials = subscriptions.filter(
      (s) => s.status === 'TRIAL'
    ).length;

    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const trialsExpiringSoon = subscriptions.filter(
      (s) =>
        s.status === 'TRIAL' &&
        s.trialEndDate &&
        new Date(s.trialEndDate) >= now &&
        new Date(s.trialEndDate) <= sevenDaysFromNow
    ).length;

    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === 'ACTIVE'
    ).length;

    const monthlySubscribers = subscriptions.filter(
      (s) => s.status === 'ACTIVE' && s.billingCycle === 'MONTHLY'
    ).length;

    const yearlySubscribers = subscriptions.filter(
      (s) => s.status === 'ACTIVE' && s.billingCycle === 'YEARLY'
    ).length;

    const expiredSubscriptions = subscriptions.filter(
      (s) => s.status === 'EXPIRED'
    ).length;

    const paymentFailed = subscriptions.filter(
      (s) => s.status === 'PAYMENT_FAILED'
    ).length;

    const cancelledSubscriptions = subscriptions.filter(
      (s) => s.status === 'CANCELLED'
    ).length;

    return {
      totalContractors,
      activeTrials,
      trialsExpiringSoon,
      activeSubscriptions,
      monthlySubscribers,
      yearlySubscribers,
      expiredSubscriptions,
      paymentFailed,
      cancelledSubscriptions,
    };
  }

  async getTenants(query) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      subscriptionStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter = { isDeleted: false };

    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const tenants = await Tenant.find(filter)
      .populate({
        path: 'owner',
        select: '_id fullName email mobileNumber',
      })
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const subscriptions = await Subscription.find({
      tenant: { $in: tenants.map((t) => t._id) },
      isDeleted: false,
    }).populate('plan');

    const subscriptionMap = new Map();
    for (const subscription of subscriptions) {
      subscriptionMap.set(subscription.tenant.toString(), subscription);
    }

    const enrichedTenants = tenants.map((tenant) => {
      const subscription = subscriptionMap.get(tenant._id.toString());

      return {
        _id: tenant._id,
        companyName: tenant.companyName,
        owner: tenant.owner,
        email: tenant.email,
        mobileNumber: tenant.mobileNumber,
        status: tenant.status,
        createdAt: tenant.createdAt,
        subscriptionStatus: subscription?.status || 'NONE',
        billingCycle: subscription?.billingCycle || null,
        trialEnd: subscription?.trialEndDate || null,
        subscriptionEnd: subscription?.endDate || null,
        plan: subscription?.plan || null,
      };
    });

    const total = await Tenant.countDocuments(filter);

    return {
      tenants: enrichedTenants,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getTenantById(tenantId) {
    const tenant = await Tenant.findOne({
      _id: tenantId,
      isDeleted: false,
    }).populate({
      path: 'owner',
      select: '_id fullName email mobileNumber',
    });

    if (!tenant) {
      return null;
    }

    const subscription = await Subscription.findOne({
      tenant: tenantId,
      isDeleted: false,
    }).populate('plan');

    const workerCount = await Worker.countDocuments({
      tenant: tenantId,
      isDeleted: false,
    });

    const siteCount = await Site.countDocuments({
      tenant: tenantId,
      isDeleted: false,
    });

    const adminCount = await User.countDocuments({
      tenant: tenantId,
      role: { $in: ['SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'] },
      isDeleted: false,
    });

    return {
      tenant,
      subscription,
      usage: {
        workerCount,
        siteCount,
        adminCount,
      },
    };
  }

  async getTenantSubscription(tenantId) {
    const subscription = await Subscription.findOne({
      tenant: tenantId,
      isDeleted: false,
    }).populate('plan');

    return subscription;
  }
}

export default new PlatformRepository();
