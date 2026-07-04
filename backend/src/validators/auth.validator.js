import Joi from 'joi';

/**
 * Register Validation
 */
export const registerSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .email()
    .lowercase()
    .required(),

  mobileNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

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
    .required(),

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