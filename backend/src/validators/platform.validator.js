import Joi from 'joi';

export const getPlatformTenantsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(''),
  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'INACTIVE').allow(''),
  subscriptionStatus: Joi.string().valid('TRIAL', 'ACTIVE', 'EXPIRED', 'PAYMENT_FAILED', 'CANCELLED', 'NONE').allow(''),
  sortBy: Joi.string().valid('companyName', 'email', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const getPlatformTenantDetailsQuerySchema = Joi.object({
  tenantId: Joi.string().length(24).hex().required(),
});
