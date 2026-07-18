import Joi from 'joi';

export const createSiteSchema = Joi.object({
  
  siteName: Joi.string()
    .trim()
    .min(3)
    .max(150)
    .required(),

  clientName: Joi.string()
    .trim()
    .min(3)
    .max(150)
    .required(),

  projectName: Joi.string()
    .trim()
    .min(3)
    .max(150)
    .required(),

  address: Joi.string()
    .trim()
    .min(5)
    .max(300)
    .required(),

  city: Joi.string()
    .trim()
    .max(100)
    .required(),

  district: Joi.string()
    .trim()
    .max(100)
    .required(),

  state: Joi.string()
    .trim()
    .max(100)
    .required(),

  pincode: Joi.string()
    .pattern(/^[1-9][0-9]{5}$/)
    .required(),

  contactPerson: Joi.string()
    .trim()
    .max(100)
    .required(),

  contactNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  email: Joi.string()
    .email()
    .allow(null, ''),

  startDate: Joi.date()
    .required(),

  endDate: Joi.date()
    .allow(null),

  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE')
    .default('ACTIVE'),

  description: Joi.string()
    .max(500)
    .allow('', null),
});

export const updateSiteSchema = Joi.object({
  siteName: Joi.string()
    .trim()
    .min(3)
    .max(150),

  clientName: Joi.string()
    .trim()
    .min(3)
    .max(150),

  projectName: Joi.string()
    .trim()
    .min(3)
    .max(150),

  address: Joi.string()
    .trim()
    .min(5)
    .max(300),

  city: Joi.string()
    .trim()
    .max(100),

  district: Joi.string()
    .trim()
    .max(100),

  state: Joi.string()
    .trim()
    .max(100),

  pincode: Joi.string().pattern(
    /^[1-9][0-9]{5}$/
  ),

  contactPerson: Joi.string()
    .trim()
    .max(100),

  contactNumber: Joi.string().pattern(
    /^[6-9]\d{9}$/
  ),

  email: Joi.string()
    .email()
    .allow(null, ''),

  startDate: Joi.date(),

  endDate: Joi.date()
    .allow(null),

  status: Joi.string().valid(
    'ACTIVE',
    'INACTIVE'
  ),

  description: Joi.string()
    .max(500)
    .allow('', null),
}).min(1);

export const changeSiteStatusSchema =
  Joi.object({
    status: Joi.string()
      .valid('ACTIVE', 'INACTIVE')
      .required(),
  });

export const getSitesQuerySchema = Joi.object({
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

  status: Joi.string().valid(
    'ACTIVE',
    'INACTIVE'
  ),

  city: Joi.string().trim(),

  state: Joi.string().trim(),

  clientName: Joi.string().trim(),

  sortBy: Joi.string().default(
    'createdAt'
  ),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc'),
});