import Joi from 'joi';

/**
 * ===============================
 * Create User
 * ===============================
 */
export const createUserSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  mobileNumber: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Please enter a valid 10-digit mobile number.',
    }),

  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number and special character.',
    }),

  role: Joi.string()
    .length(24)
    .hex()
    .required(),
});

/**
 * ===============================
 * Update User
 * ===============================
 */
export const updateUserSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100),

  email: Joi.string()
    .trim()
    .lowercase()
    .email(),

  mobileNumber: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      'string.pattern.base':
        'Please enter a valid 10-digit mobile number.',
    }),

  role: Joi.string()
  .valid(
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "SUPERVISOR"
  )
  .required()
  .messages({
    "any.only": "Invalid role selected.",
    "any.required": "Role is required."
  }),

  status: Joi.string()
    .valid(
      'ACTIVE',
      'INACTIVE',
      'SUSPENDED'
    ),
})
  .min(1)
  .messages({
    'object.min':
      'At least one field is required to update.',
  });

/**
 * ===============================
 * Change User Status
 * ===============================
 */
export const changeUserStatusSchema =
  Joi.object({
    status: Joi.string()
      .valid(
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED'
      )
      .required(),
  });

/**
 * ===============================
 * Get Users Query
 * ===============================
 */
export const getUsersQuerySchema =
  Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10),

    search: Joi.string()
      .trim()
      .allow(''),

    role: Joi.string()
      .length(24)
      .hex()
      .allow(''),

    status: Joi.string()
      .valid(
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED'
      )
      .allow(''),

    sortBy: Joi.string()
      .valid(
        'fullName',
        'email',
        'mobileNumber',
        'createdAt'
      )
      .default('createdAt'),

    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc'),
  });