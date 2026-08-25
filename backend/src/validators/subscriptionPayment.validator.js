import Joi from 'joi';

export const createPaymentOrderSchema = Joi.object({
  billingCycle: Joi.string().valid('MONTHLY', 'YEARLY').required(),
});

export const verifyPaymentSchema = Joi.object({
  providerOrderId: Joi.string().required(),

  providerPaymentId: Joi.string().required(),

  providerSignature: Joi.string().required(),

  billingCycle: Joi.string().valid('MONTHLY', 'YEARLY').required(),

  amount: Joi.number().min(0).required(),

  currency: Joi.string().length(3).uppercase().required(),
});

export const getPaymentHistoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const getSubscriptionPaymentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(100).default(10),
});
