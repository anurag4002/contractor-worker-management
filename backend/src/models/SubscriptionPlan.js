import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    code: {
      type: String,
      required: [true, 'Plan code is required'],
      trim: true,
      uppercase: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    pricing: {
      monthly: {
        type: Number,
        required: [true, 'Monthly price is required'],
        min: [0, 'Price cannot be negative'],
      },
      annual: {
        type: Number,
        required: [true, 'Annual price is required'],
        min: [0, 'Price cannot be negative'],
      },
    },

    currency: {
      type: String,
      required: [true, 'Currency is required'],
      trim: true,
      uppercase: true,
      default: 'INR',
    },

    features: {
      type: [String],
      default: [],
    },

    limits: {
      maxWorkers: {
        type: Number,
        default: null,
      },
      maxSites: {
        type: Number,
        default: null,
      },
      maxAdmins: {
        type: Number,
        default: null,
      },
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
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

subscriptionPlanSchema.index({ code: 1 });
subscriptionPlanSchema.index({ status: 1 });
subscriptionPlanSchema.index({ isDeleted: 1 });

const SubscriptionPlan = mongoose.model(
  'SubscriptionPlan',
  subscriptionPlanSchema
);

export default SubscriptionPlan;
