import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },

    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site',
      required: true,
    },

    attendanceMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    attendanceYear: {
      type: Number,
      required: true,
      min: 2024,
    },

    workingDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    presentDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    absentDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    halfDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    leaveDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    regularHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtimeHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    dailyWage: {
      type: Number,
      required: true,
      min: 0,
    },

    overtimeRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    basicSalary: {
      type: Number,
      default: 0,
      min: 0,
    },

    overtimeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    bonus: {
      type: Number,
      default: 0,
      min: 0,
    },

    deduction: {
      type: Number,
      default: 0,
      min: 0,
    },

    advanceDeduction: {
      type: Number,
      default: 0,
      min: 0,
    },

    grossSalary: {
      type: Number,
      default: 0,
      min: 0,
    },

    netSalary: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        'PENDING',
        'GENERATED',
        'PAID',
        'CANCELLED',
      ],
      default: 'PENDING',
    },

    remarks: {
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

// One payroll per worker per month
payrollSchema.index(
  {
    worker: 1,
    attendanceMonth: 1,
    attendanceYear: 1,
  },
  {
    unique: true,
  }
);

// Frequently queried indexes
payrollSchema.index({
  site: 1,
});

payrollSchema.index({
  status: 1,
});

payrollSchema.index({
  attendanceMonth: 1,
  attendanceYear: 1,
});

payrollSchema.index({
  isDeleted: 1,
});

const Payroll = mongoose.model(
  'Payroll',
  payrollSchema
);

export default Payroll;