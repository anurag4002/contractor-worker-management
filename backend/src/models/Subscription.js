import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant is required'],
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: [true, 'Plan is required'],
    },

    status: {
      type: String,
      enum: ['TRIAL', 'ACTIVE', 'PAYMENT_FAILED', 'GRACE_PERIOD', 'CANCELLED', 'EXPIRED', 'SUSPENDED'],
      required: [true, 'Status is required'],
    },

    billingCycle: {
      type: String,
      enum: ['MONTHLY', 'YEARLY'],
      default: null,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    trialStart: {
      type: Date,
      default: null,
    },

    trialEndDate: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    paymentFailedAt: {
      type: Date,
      default: null,
    },

    gracePeriodEndsAt: {
      type: Date,
      default: null,
    },

    autoRenew: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
|--------------------------------------------------------------------------
| Database Indexes
|--------------------------------------------------------------------------
*/

subscriptionSchema.index({ tenant: 1 });

// Prevent duplicate active subscriptions for the same tenant
subscriptionSchema.index(
  { tenant: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: 'ACTIVE',
      isDeleted: false,
    },
  }
);

const Subscription = mongoose.model(
  'Subscription',
  subscriptionSchema
);

export default Subscription;
