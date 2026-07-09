import { StatusCodes } from 'http-status-codes';

import ApiError from '../common/errors/ApiError.js';
import COMMON_MESSAGES from '../common/constants/common.messages.js';

const notFoundMiddleware = (req, res, next) => {
  next(
    new ApiError(
      StatusCodes.NOT_FOUND,
      COMMON_MESSAGES.NOT_FOUND,
      {
        method: req.method,
        path: req.originalUrl,
      }
    )
  );
};

export default notFoundMiddleware;