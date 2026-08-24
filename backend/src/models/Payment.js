import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    payroll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payroll',
      required: true,
    },

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

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentType: {
      type: String,
      enum: ['ADVANCE', 'FULL', 'PARTIAL'],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE'],
      required: true,
    },

    transactionId: {
      type: String,
      trim: true,
      default: '',
    },

    remark: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant is required'],
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING', 'CANCELLED'],
      default: 'COMPLETED',
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

paymentSchema.index({
  tenant: 1,
});

paymentSchema.index({
  payroll: 1,
});

paymentSchema.index({
  worker: 1,
});

paymentSchema.index({
  status: 1,
});

paymentSchema.index({
  paymentDate: -1,
});

paymentSchema.index({
  isDeleted: 1,
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
