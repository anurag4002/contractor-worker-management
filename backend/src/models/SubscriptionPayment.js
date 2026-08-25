import mongoose from 'mongoose';

const subscriptionPaymentSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant is required'],
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: [true, 'Subscription is required'],
    },

    provider: {
      type: String,
      required: [true, 'Payment provider is required'],
      enum: ['RAZORPAY', 'STRIPE', 'CASHFREE', 'PAYU', 'MANUAL'],
      default: 'RAZORPAY',
    },

    providerOrderId: {
      type: String,
      trim: true,
      default: '',
    },

    providerPaymentId: {
      type: String,
      trim: true,
      default: '',
    },

    providerSignature: {
      type: String,
      trim: true,
      default: '',
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },

    currency: {
      type: String,
      required: [true, 'Currency is required'],
      trim: true,
      uppercase: true,
      default: 'INR',
    },

    billingCycle: {
      type: String,
      enum: ['MONTHLY', 'YEARLY'],
      required: [true, 'Billing cycle is required'],
    },

    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'],
      default: 'PENDING',
    },

    paidAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

subscriptionPaymentSchema.index({ tenant: 1 });
subscriptionPaymentSchema.index({ subscription: 1 });
subscriptionPaymentSchema.index({ providerOrderId: 1 });
subscriptionPaymentSchema.index({ providerPaymentId: 1 });
subscriptionPaymentSchema.index({ status: 1 });
subscriptionPaymentSchema.index({ paidAt: -1 });
subscriptionPaymentSchema.index({ isDeleted: 1 });

const SubscriptionPayment = mongoose.model(
  'SubscriptionPayment',
  subscriptionPaymentSchema
);

export default SubscriptionPayment;
