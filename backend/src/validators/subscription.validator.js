import Joi from 'joi';

export const createSubscriptionSchema = Joi.object({
  tenantId: Joi.string().length(24).hex().required(),

  planId: Joi.string().length(24).hex().required(),

  billingCycle: Joi.string().valid('MONTHLY', 'ANNUAL').required(),
});

export const getSubscriptionQuerySchema = Joi.object({
  tenantId: Joi.string().length(24).hex(),
});

export const getCurrentSubscriptionQuerySchema = Joi.object({
  tenantId: Joi.string().length(24).hex(),
});

export const updateSubscriptionStatusSchema = Joi.object({
  status: Joi.string().valid('TRIAL', 'ACTIVE', 'PAYMENT_FAILED', 'GRACE_PERIOD', 'CANCELLED', 'EXPIRED', 'SUSPENDED').required(),
});

export const getSubscriptionsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('TRIAL', 'ACTIVE', 'PAYMENT_FAILED', 'GRACE_PERIOD', 'CANCELLED', 'EXPIRED', 'SUSPENDED').allow(''),
  search: Joi.string().trim().allow(''),
  sortBy: Joi.string().valid('status', 'billingCycle', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
