import { StatusCodes } from 'http-status-codes';

import ApiError from '../common/errors/ApiError.js';

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map(
        (detail) => detail.message
      );

      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'Validation Failed',
          errors
        )
      );
    }

    req.body = value;

    next();
  };
};

export default validate;