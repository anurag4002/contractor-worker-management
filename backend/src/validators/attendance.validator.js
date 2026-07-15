import Joi from 'joi';

export const createAttendanceSchema = Joi.object({
  worker: Joi.string()
    .hex()
    .length(24)
    .required(),

  site: Joi.string()
    .hex()
    .length(24)
    .required(),

  attendanceDate: Joi.date()
    .required(),

  status: Joi.string()
    .valid(
      'PRESENT',
      'ABSENT',
      'HALF_DAY',
      'LEAVE',
      'HOLIDAY'
    )
    .default('PRESENT'),

  checkIn: Joi.date()
    .allow(null),

  checkOut: Joi.date()
    .allow(null),

  regularHours: Joi.number()
    .min(0)
    .default(0),

  overtimeHours: Joi.number()
    .min(0)
    .default(0),

  remarks: Joi.string()
    .max(500)
    .allow('', null),
});

export const updateAttendanceSchema =
  Joi.object({
    worker: Joi.string()
      .hex()
      .length(24),

    site: Joi.string()
      .hex()
      .length(24),

    attendanceDate: Joi.date(),

    status: Joi.string().valid(
      'PRESENT',
      'ABSENT',
      'HALF_DAY',
      'LEAVE',
      'HOLIDAY'
    ),

    checkIn: Joi.date()
      .allow(null),

    checkOut: Joi.date()
      .allow(null),

    regularHours: Joi.number()
      .min(0),

    overtimeHours: Joi.number()
      .min(0),

    remarks: Joi.string()
      .max(500)
      .allow('', null),
  }).min(1);

export const changeAttendanceStatusSchema =
  Joi.object({
    status: Joi.string()
      .valid(
        'PRESENT',
        'ABSENT',
        'HALF_DAY',
        'LEAVE',
        'HOLIDAY'
      )
      .required(),
  });

export const getAttendanceQuerySchema =
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

    attendanceDate: Joi.date(),

    status: Joi.string().valid(
      'PRESENT',
      'ABSENT',
      'HALF_DAY',
      'LEAVE',
      'HOLIDAY'
    ),

    sortBy: Joi.string()
      .default('attendanceDate'),

    sortOrder: Joi.string()
      .valid('asc', 'desc')
      .default('desc'),
  });