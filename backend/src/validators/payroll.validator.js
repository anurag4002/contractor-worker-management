import Joi from 'joi';

export const createPayrollSchema = Joi.object({
  worker: Joi.string()
    .hex()
    .length(24)
    .required(),

  site: Joi.string()
    .hex()
    .length(24)
    .required(),

  attendanceMonth: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required(),

  attendanceYear: Joi.number()
    .integer()
    .min(2024)
    .required(),

  dailyWage: Joi.number()
    .min(0)
    .required(),

  overtimeRate: Joi.number()
    .min(0)
    .default(0),

  bonus: Joi.number()
    .min(0)
    .default(0),

  deduction: Joi.number()
    .min(0)
    .default(0),

  advanceDeduction: Joi.number()
    .min(0)
    .default(0),

  remarks: Joi.string()
    .max(500)
    .allow('', null),
});

export const updatePayrollSchema =
  Joi.object({
    dailyWage: Joi.number()
      .min(0),

    overtimeRate: Joi.number()
      .min(0),

    bonus: Joi.number()
      .min(0),

    deduction: Joi.number()
      .min(0),

    advanceDeduction: Joi.number()
      .min(0),

    remarks: Joi.string()
      .max(500)
      .allow('', null),
  }).min(1);

export const changePayrollStatusSchema =
  Joi.object({
    status: Joi.string()
      .valid(
        'PENDING',
        'GENERATED',
        'PAID',
        'CANCELLED'
      )
      .required(),
  });

export const getPayrollQuerySchema =
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

    worker: Joi.string()
      .hex()
      .length(24),

    site: Joi.string()
      .hex()
      .length(24),

    attendanceMonth: Joi.number()
      .integer()
      .min(1)
      .max(12),

    attendanceYear: Joi.number()
      .integer()
      .min(2024),

    status: Joi.string().valid(
      'PENDING',
      'GENERATED',
      'PAID',
      'CANCELLED'
    ),

    sortBy: Joi.string()
      .default('createdAt'),

    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc'),
  });