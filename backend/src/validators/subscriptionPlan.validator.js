import Joi from 'joi';

export const createSubscriptionPlanSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  code: Joi.string().trim().uppercase().min(3).max(50).required(),

  description: Joi.string().trim().max(500).allow('', null).optional(),

  pricing: Joi.object({
    monthly: Joi.number().min(0).required(),
    annual: Joi.number().min(0).required(),
  }).required(),

  currency: Joi.string().trim().uppercase().length(3).optional(),

  features: Joi.array().items(Joi.string().trim()).optional(),

  limits: Joi.object({
    maxWorkers: Joi.number().integer().min(0).allow(null).optional(),
    maxSites: Joi.number().integer().min(0).allow(null).optional(),
    maxAdmins: Joi.number().integer().min(0).allow(null).optional(),
  }).optional(),

  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
});

export const updateSubscriptionPlanSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  code: Joi.string().trim().uppercase().min(3).max(50),

  description: Joi.string().trim().max(500).allow('', null),

  pricing: Joi.object({
    monthly: Joi.number().min(0).required(),
    annual: Joi.number().min(0).required(),
  }),

  currency: Joi.string().trim().uppercase().length(3),

  features: Joi.array().items(Joi.string().trim()),

  limits: Joi.object({
    maxWorkers: Joi.number().integer().min(0).allow(null),
    maxSites: Joi.number().integer().min(0).allow(null),
    maxAdmins: Joi.number().integer().min(0).allow(null),
  }),

  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required to update.',
  });

export const getSubscriptionPlansQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').allow(''),
  sortBy: Joi.string().valid('name', 'code', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
