import { StatusCodes } from 'http-status-codes';

import ApiError from '../common/errors/ApiError.js';
import COMMON_MESSAGES from '../common/constants/common.messages.js';

const notFoundMiddleware = (req, res, next) => {
  console.log('[NOT_FOUND] Falling through:', {
    method: req.method,
    path: req.originalUrl,
    url: req.url,
    headers: req.headers,
  });

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