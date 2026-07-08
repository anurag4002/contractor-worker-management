const COMMON_MESSAGES = {
  SUCCESS: 'Success.',

  CREATED: 'Resource created successfully.',

  UPDATED: 'Resource updated successfully.',

  DELETED: 'Resource deleted successfully.',

  FETCHED: 'Data fetched successfully.',

  VALIDATION_FAILED: 'Validation failed.',

  INTERNAL_SERVER_ERROR: 'Internal server error.',

  UNAUTHORIZED: 'Unauthorized access.',

  FORBIDDEN: 'Access denied.',

  NOT_FOUND: 'Resource not found.',
};import { StatusCodes } from 'http-status-codes';

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

    req[property] = value;

    next();
  };
};

export default validate;

export default COMMON_MESSAGES;