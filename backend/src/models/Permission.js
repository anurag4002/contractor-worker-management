import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    code: {
      type: String,
      required: [true, 'Permission code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },

    module: {
      type: String,
      required: [true, 'Module name is required'],
      trim: true,
      lowercase: true,
      enum: [
        'auth',
        'user',
        'worker',
        'site',
        'attendance',
        'payroll',
        'advance-payment',
        'dashboard',
        'report',
        'notification',
        'audit-log',
      ],
    },

    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      lowercase: true,
      enum: [
        'create',
        'read',
        'update',
        'delete',
        'approve',
        'reject',
        'export',
        'import',
        'assign',
        'manage',
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 255,
      default: '',
    },

    isSystemPermission: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
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

// ==============================
// Database Indexes
// ==============================

permissionSchema.index({ code: 1 });
permissionSchema.index({ module: 1 });
permissionSchema.index({ action: 1 });
permissionSchema.index({ status: 1 });
permissionSchema.index({ isDeleted: 1 });

permissionSchema.index({ module: 1, action: 1 });
permissionSchema.index({ code: 1, isDeleted: 1 });
const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;