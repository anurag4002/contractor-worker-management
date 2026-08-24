import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema(
  {
    siteCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    siteName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    projectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      match: /^[1-9][0-9]{5}$/,
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[6-9]\d{9}$/,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant is required'],
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
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

    workers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Worker',
      default: [],
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

// Unique index
siteSchema.index({ tenant: 1, siteCode: 1 }, { unique: true });

// Frequently queried fields
siteSchema.index({ siteName: 1 });
siteSchema.index({ clientName: 1 });
siteSchema.index({ projectName: 1 });
siteSchema.index({ status: 1 });
siteSchema.index({ isDeleted: 1 });
siteSchema.index({ tenant: 1 });

// Compound indexes
siteSchema.index({ tenant: 1, isDeleted: 1 });
siteSchema.index({
  siteName: 'text',
  clientName: 'text',
  projectName: 'text',
});

const Site = mongoose.model('Site', siteSchema);

export default Site;