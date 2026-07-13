import { StatusCodes } from 'http-status-codes';

import ApiError from '../common/errors/ApiError.js';
import COMMON_MESSAGES from '../common/constants/common.messages.js';

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
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
          COMMON_MESSAGES.VALIDATION_FAILED,
          errors
        )
      );
    }

    if (property === 'body') {
      req.body = value;
    } else if (property === 'params') {
      req.params = value;
    } else if (property === 'query') {
      Object.assign(req.query, value);
    }

    next();
  };
};

export default validate;