import Joi from 'joi';

/**
 * ===============================
 * Create Notification
 * ===============================
 */
export const createNotificationSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(150)
    .required(),

  message: Joi.string()
    .trim()
    .min(3)
    .max(1000)
    .required(),

  type: Joi.string()
    .valid(
      'INFO',
      'SUCCESS',
      'WARNING',
      'ERROR'
    )
    .default('INFO'),

  recipient: Joi.string()
    .length(24)
    .hex()
    .required(),

  status: Joi.string()
    .valid(
      'ACTIVE',
      'INACTIVE'
    )
    .default('ACTIVE'),
});

/**
 * ===============================
 * Notification ID
 * ===============================
 */
export const notificationIdSchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required(),
});

/**
 * ===============================
 * Notification Query
 * ===============================
 */
export const notificationQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  recipient: Joi.string()
    .length(24)
    .hex()
    .allow(''),

  isRead: Joi.boolean(),

  status: Joi.string()
    .valid(
      'ACTIVE',
      'INACTIVE'
    )
    .allow(''),

  type: Joi.string()
    .valid(
      'INFO',
      'SUCCESS',
      'WARNING',
      'ERROR'
    )
    .allow(''),

  sortBy: Joi.string()
    .valid(
      'createdAt',
      'title',
      'type'
    )
    .default('createdAt'),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc'),
});