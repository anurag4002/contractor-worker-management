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

    error = new ApiError(
      StatusCodes.CONFLICT,
      `${field} already exists`
    );
  }

  // Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(
      (value) => value.message
    );

    error = new ApiError(
      StatusCodes.BAD_REQUEST,
      'Validation Failed',
      errors
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