import mongoose from 'mongoose';

const notificationSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          'INFO',
          'SUCCESS',
          'WARNING',
          'ERROR',
        ],
        default: 'INFO',
      },

      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      isRead: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: [
          'ACTIVE',
          'INACTIVE',
        ],
        default: 'ACTIVE',
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },

      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

notificationSchema.index({
  recipient: 1,
  isRead: 1,
});

notificationSchema.index({
  createdAt: -1,
});

export default mongoose.model(
  'Notification',
  notificationSchema
);