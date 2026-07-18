import Joi from 'joi';

/**
 * ==========================================
 * Create Role
 * ==========================================
 */
export const createRoleSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50)
    .required(),

  description: Joi.string()
    .trim()
    .max(255)
    .allow('')
    .default(''),

  permissions: Joi.array()
    .items(
      Joi.string()
        .length(24)
        .hex()
    )
    .default([]),
});

/**
 * ==========================================
 * Update Role
 * ==========================================
 */
export const updateRoleSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50),

  description: Joi.string()
    .trim()
    .max(255)
    .allow(''),

  permissions: Joi.array().items(
    Joi.string()
      .length(24)
      .hex()
  ),
})
  .min(1)
  .messages({
    'object.min':
      'At least one field is required to update.',
  });

/**
 * ==========================================
 * Change Role Status
 * ==========================================
 */
export const changeRoleStatusSchema =
  Joi.object({
    status: Joi.string()
      .valid(
        'ACTIVE',
        'INACTIVE'
      )
      .required(),
  });

/**
 * ==========================================
 * Get Roles Query
 * ==========================================
 */
export const getRolesQuerySchema =
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

    status: Joi.string()
      .valid(
        'ACTIVE',
        'INACTIVE'
      )
      .allow(''),

    sortBy: Joi.string()
      .valid(
        'name',
        'code',
        'createdAt'
      )
      .default('createdAt'),

    sortOrder: Joi.string()
      .valid(
        'asc',
        'desc'
      )
      .default('desc'),
  });