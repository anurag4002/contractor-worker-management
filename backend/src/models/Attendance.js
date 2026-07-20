import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
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

    attendanceDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'PRESENT',
        'ABSENT',
        'HALF_DAY',
        'LEAVE',
        'HOLIDAY',
      ],
      required: true,
      default: 'PRESENT',
    },

    checkIn: {
      type: Date,
      default: null,
    },

    checkOut: {
      type: Date,
      default: null,
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

// One attendance per worker per day
attendanceSchema.index(
  {
    worker: 1,
    attendanceDate: 1,
  },
  {
    unique: true,
  }
);

// Frequently queried indexes
attendanceSchema.index({
  site: 1,
  attendanceDate: 1,
});

attendanceSchema.index({
  attendanceDate: 1,
});

attendanceSchema.index({
  status: 1,
});

attendanceSchema.index({
  isDeleted: 1,
});

attendanceSchema.index({
  worker: 1,
  attendanceDate: 1,
  isDeleted: 1,
});

attendanceSchema.index({
  site: 1,
  attendanceDate: 1,
  isDeleted: 1,
});

const Attendance = mongoose.model(
  'Attendance',
  attendanceSchema
);

export default Attendance;