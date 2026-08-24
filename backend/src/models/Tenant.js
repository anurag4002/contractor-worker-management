import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Invalid mobile number'],
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      default: null,
    },

    district: {
      type: String,
      trim: true,
      default: null,
    },

    state: {
      type: String,
      trim: true,
      default: null,
    },

    pincode: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE'],
      default: 'ACTIVE',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    updatedBy: {
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

/*
|--------------------------------------------------------------------------
| Database Indexes
|--------------------------------------------------------------------------
*/

// Unique indexes - partial index to allow email reuse after soft-delete
tenantSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);

// Frequently queried fields
tenantSchema.index({ owner: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ isDeleted: 1 });
tenantSchema.index({ companyName: 1 });

// Compound indexes
tenantSchema.index({ owner: 1, isDeleted: 1 });
tenantSchema.index({ status: 1, isDeleted: 1 });

const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;
