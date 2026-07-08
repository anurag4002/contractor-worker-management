import Joi from 'joi';

/**
 * Register Validation
 */
export const registerSchema = Joi.object({
  fullName: Joi.string()
  .trim()
  .min(2)
  .max(100)
  .required()
  .messages({
    'string.empty': 'Full name is required.',
    'any.required': 'Full name is required.',
    'string.min': 'Full name must contain at least 2 characters.',
    'string.max': 'Full name cannot exceed 100 characters.',
  }),

  email: Joi.string()
  .email()
  .required()
  .messages({
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
    'string.email': 'Please enter a valid email address.',
  }),

  mobileNumber: Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .required()
  .messages({
    'string.empty': 'Mobile number is required.',
    'any.required': 'Mobile number is required.',
    'string.pattern.base':
      'Please enter a valid 10-digit Indian mobile number.',
  }),

  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .alphanum()
    .required(),

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
    .hex()
    .length(24)
    .required(),
});

/**
 * Login Validation
 */
export const loginSchema = Joi.object({
  email: Joi.string()
  .email()
  .required()
  .messages({
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
    'string.email': 'Please enter a valid email address.',
  }),

  password: Joi.string()
    .required(),
});

/**
 * Refresh Token Validation
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required(),
});

/**
 * Forgot Password Validation
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

/**
 * Reset Password Validation
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required(),

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
});

/**
 * Change Password Validation
 */
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .required(),

  newPassword: Joi.string()
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
});