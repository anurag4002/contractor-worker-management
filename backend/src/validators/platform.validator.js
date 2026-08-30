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

export const getPlatformPaymentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(''),
  status: Joi.string().valid('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED').allow(''),
  billingCycle: Joi.string().valid('MONTHLY', 'YEARLY').allow(''),
  startDate: Joi.string().allow(''),
  endDate: Joi.string().allow(''),
  sortBy: Joi.string().valid('createdAt', 'amount', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const getPlatformExpiringSubscriptionsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  expiresWithin: Joi.number().integer().min(1).max(365).default(30),
  sortBy: Joi.string().valid('endDate', 'createdAt').default('endDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
});
