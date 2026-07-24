import { StatusCodes } from 'http-status-codes';

import ApiError from '../common/errors/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert unknown errors to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    const message =
      error.message || 'Internal Server Error';

    error = new ApiError(statusCode, message, error.errors || [], error.stack);
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    error = new ApiError(
      StatusCodes.BAD_REQUEST,
      `Invalid ${err.path}: ${err.value}`
    );
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    const duplicateErrors = {};
    duplicateErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;

    error = new ApiError(
      StatusCodes.CONFLICT,
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      duplicateErrors
    );
  }

  // Validation Error
  if (err.name === 'ValidationError') {
    const validationErrors = {};
    for (const [key, value] of Object.entries(err.errors)) {
      validationErrors[key] = value.message;
    }

    error = new ApiError(
      StatusCodes.BAD_REQUEST,
      'Validation Failed',
      validationErrors
    );
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Invalid Token'
    );
  }

  // JWT Expired
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(
      StatusCodes.UNAUTHORIZED,
      'Token Expired'
    );
  }

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: error.stack,
    }),
  });
};

export default errorHandler;