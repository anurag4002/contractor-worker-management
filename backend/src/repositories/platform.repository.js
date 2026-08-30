import Tenant from '../models/Tenant.js';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import Worker from '../models/Worker.js';
import Site from '../models/Site.js';
import User from '../models/User.js';
import SubscriptionPayment from '../models/SubscriptionPayment.js';
import Role from '../models/Role.js';

class PlatformRepository {
  async getDashboardStats() {
    const tenants = await Tenant.find({ isDeleted: false }).select('_id');

    const tenantIds = tenants.map((tenant) => tenant._id);

    const subscriptions = await Subscription.find({
      tenant: { $in: tenantIds },
      isDeleted: false,
    }).populate('plan');

    const payments = await SubscriptionPayment.find({
      tenant: { $in: tenantIds },
      isDeleted: false,
      status: 'COMPLETED',
    });

    const now = new Date();
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const totalContractors = tenants.length;

    const activeTrials = subscriptions.filter(
      (s) => s.status === 'TRIAL'
    ).length;

    const trialsExpiringSoon = subscriptions.filter(
      (s) =>
        s.status === 'TRIAL' &&
        s.trialEndDate &&
        new Date(s.trialEndDate) >= now &&
        new Date(s.trialEndDate) <= thirtyDaysFromNow
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

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue = payments
      .filter((p) => new Date(p.createdAt) >= currentMonth)
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    const currentYear = new Date(now.getFullYear(), 0, 1);
    const annualRevenue = payments
      .filter((p) => new Date(p.createdAt) >= currentYear)
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    const totalPayments = payments.length;
    const successfulPayments = payments.filter(
      (p) => p.status === 'COMPLETED'
    ).length;
    const failedPayments = await SubscriptionPayment.countDocuments({
      tenant: { $in: tenantIds },
      isDeleted: false,
      status: 'FAILED',
    });
    const pendingPayments = await SubscriptionPayment.countDocuments({
      tenant: { $in: tenantIds },
      isDeleted: false,
      status: 'PENDING',
    });

    const expiringSoon = subscriptions.filter(
      (s) =>
        (s.status === 'ACTIVE' || s.status === 'TRIAL') &&
        s.endDate &&
        new Date(s.endDate) >= now &&
        new Date(s.endDate) <= thirtyDaysFromNow
    ).length;

    const recentUsers = await User.find({ isDeleted: false })
      .select('fullName email mobileNumber createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPayments = await SubscriptionPayment.find({
      tenant: { $in: tenantIds },
      isDeleted: false,
    })
      .populate('tenant', 'companyName')
      .sort({ createdAt: -1 })
      .limit(5);

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
      totalRevenue,
      monthlyRevenue,
      annualRevenue,
      totalPayments,
      successfulPayments,
      failedPayments,
      pendingPayments,
      expiringSoon,
      recentUsers: recentUsers.map((u) => ({
        _id: u._id,
        fullName: u.fullName,
        email: u.email,
        mobileNumber: u.mobileNumber,
        createdAt: u.createdAt,
      })),
      recentPayments: recentPayments.map((p) => ({
        _id: p._id,
        amount: p.amount,
        currency: p.currency,
        billingCycle: p.billingCycle,
        status: p.status,
        providerOrderId: p.providerOrderId,
        providerPaymentId: p.providerPaymentId,
        paidAt: p.paidAt,
        createdAt: p.createdAt,
        tenant: p.tenant,
      })),
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

    const adminRoles = await Role.find({
      code: { $in: ['SUPER_ADMIN', 'TENANT_ADMIN', 'ADMIN'] },
      isDeleted: false,
    }).select('_id');

    const adminRoleIds = adminRoles.map((role) => role._id);

    const adminCount = await User.countDocuments({
      tenant: tenantId,
      role: { $in: adminRoleIds },
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

  async getPayments(query) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      billingCycle,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const matchStage = { isDeleted: false };

    if (status) {
      matchStage.status = status;
    }

    if (billingCycle) {
      matchStage.billingCycle = billingCycle;
    }

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'tenants',
          localField: 'tenant',
          foreignField: '_id',
          as: 'tenant',
        },
      },
      { $unwind: { path: '$tenant', preserveNullAndEmptyArrays: true } },
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'tenant.companyName': { $regex: search, $options: 'i' } },
            { providerOrderId: { $regex: search, $options: 'i' } },
            { providerPaymentId: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: skip },
      { $limit: Number(limit) }
    );

    const payments = await SubscriptionPayment.aggregate(pipeline);

    const total = await SubscriptionPayment.countDocuments(matchStage);

    const successfulPayments = await SubscriptionPayment.countDocuments({
      ...matchStage,
      status: 'COMPLETED',
    });

    const totalAmount = await SubscriptionPayment.aggregate([
      { $match: { ...matchStage, status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return {
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      summary: {
        totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
        successfulPayments,
      },
    };
  }

  async getPaymentById(paymentId) {
    const payment = await SubscriptionPayment.findById(paymentId)
      .populate('tenant', 'companyName email mobileNumber')
      .populate('subscription')
      .populate('createdBy', 'fullName email');

    return payment;
  }

  async getExpiringSubscriptions(query) {
    const {
      page = 1,
      limit = 10,
      expiresWithin = 30,
      sortBy = 'endDate',
      sortOrder = 'asc',
    } = query;

    const now = new Date();
    const expiresWithinDate = new Date(now);
    expiresWithinDate.setDate(expiresWithinDate.getDate() + Number(expiresWithin));

    const subscriptions = await Subscription.find({
      isDeleted: false,
      status: { $in: ['ACTIVE', 'TRIAL'] },
      endDate: { $gte: now, $lte: expiresWithinDate },
    })
      .populate('plan')
      .populate('tenant', 'companyName email mobileNumber owner')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Subscription.countDocuments({
      isDeleted: false,
      status: { $in: ['ACTIVE', 'TRIAL'] },
      endDate: { $gte: now, $lte: expiresWithinDate },
    });

    const enriched = subscriptions.map((sub) => {
      const daysRemaining = Math.ceil(
        (new Date(sub.endDate) - now) / (1000 * 60 * 60 * 24)
      );

      return {
        ...sub.toObject(),
        daysRemaining,
      };
    });

    return {
      subscriptions: enriched,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getRecentUsers(limit = 10) {
    const users = await User.find({ isDeleted: false })
      .select('fullName email mobileNumber createdAt status tenant')
      .populate('tenant', 'companyName')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return users;
  }

  async getRecentPayments(limit = 10) {
    const payments = await SubscriptionPayment.find({ isDeleted: false })
      .populate('tenant', 'companyName')
      .populate('subscription')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return payments;
  }
}

export default new PlatformRepository();
