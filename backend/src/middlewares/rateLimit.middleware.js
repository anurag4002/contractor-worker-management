import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many registration attempts. Please try again later.',
  },
  keyGenerator: (req) => {
    return req.ip || req.connection?.remoteAddress || 'unknown';
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many login attempts. Please try again later.',
  },
  keyGenerator: (req) => {
    return req.ip || req.connection?.remoteAddress || 'unknown';
  },
});
