import Joi from 'joi';

export const createTenantSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(150).required(),

  owner: Joi.string().length(24).hex().required(),

  email: Joi.string().trim().lowercase().email().required(),

  mobileNumber: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid 10-digit mobile number.',
    }),

  address: Joi.string().trim().allow('', null).optional(),

  city: Joi.string().trim().allow('', null).optional(),

  district: Joi.string().trim().allow('', null).optional(),

  state: Joi.string().trim().allow('', null).optional(),

  pincode: Joi.string().trim().allow('', null).optional(),

  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'INACTIVE').optional(),
});

export const updateTenantSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(150),

  owner: Joi.string().length(24).hex(),

  email: Joi.string().trim().lowercase().email(),

  mobileNumber: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 10-digit mobile number.',
    }),

  address: Joi.string().trim().allow('', null),

  city: Joi.string().trim().allow('', null),

  district: Joi.string().trim().allow('', null),

  state: Joi.string().trim().allow('', null),

  pincode: Joi.string().trim().allow('', null),

  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'INACTIVE'),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required to update.',
  });

export const getTenantsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(''),
  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'INACTIVE').allow(''),
  sortBy: Joi.string().valid('companyName', 'email', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
