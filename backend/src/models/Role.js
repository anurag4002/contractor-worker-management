import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    code: {
      type: String,
      required: [true, 'Role code is required'],
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 255,
      default: '',
    },

    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],

    isSystemRole: {
      type: Boolean,
      default: false,
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

/*
|--------------------------------------------------------------------------
| Database Indexes
|--------------------------------------------------------------------------
*/

// Unique indexes
roleSchema.index({ name: 1 }, { unique: true });
roleSchema.index({ code: 1 }, { unique: true });

// Frequently queried fields
roleSchema.index({ status: 1 });
roleSchema.index({ isDeleted: 1 });

// Compound indexes
roleSchema.index({ code: 1, isDeleted: 1 });

const Role = mongoose.model('Role', roleSchema);

export default Role;