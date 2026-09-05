import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import requestLogger from './common/logger/morgan.js';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import ensureDatabaseConnection from './middlewares/database.middleware.js';
import env from './config/env.js';
import logger from './common/logger/logger.js';

const app = express();

logger.info(
  '[CORS ENV TRACE] processClientUrl=' +
    (process.env.CLIENT_URL || '(undefined)') +
    ' envClientUrl=' +
    (env.CLIENT_URL || '(undefined)') +
    ' nodeEnv=' +
    (process.env.NODE_ENV || '(undefined)') +
    ' vercelEnv=' +
    (process.env.VERCEL_ENV || '(undefined)') +
    ' vercelUrl=' +
    (process.env.VERCEL_URL || '(undefined)')
);

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

const allowedOrigins = [
  env.CLIENT_URL,
  'https://contractor-worker-management.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
].filter(Boolean);

const normalizeOrigin = (origin) => {
  if (!origin) return '';
  try {
    const url = new URL(origin);
    return `${url.protocol}//${url.host}`;
  } catch {
    return origin.trim().replace(/\/+$/, '');
  }
};

const isOriginAllowed = (origin) => {
  const normalizedOrigin = normalizeOrigin(origin);
  return allowedOrigins.some((allowed) => normalizeOrigin(allowed) === normalizedOrigin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);
      const allowed = !origin || isOriginAllowed(origin);
      logger.info(
        `[CORS DEBUG] requestOrigin=${origin || '(undefined)'} normalizedRequestOrigin=${normalizedOrigin || '(undefined)'} clientUrl=${env.CLIENT_URL || '(undefined)'} normalizedClientUrl=${normalizeOrigin(env.CLIENT_URL || '(undefined)') || '(undefined)'} allowedOrigins=${allowedOrigins.map(normalizeOrigin).filter(Boolean).join(' | ') || '(none)'} isAllowed=${allowed}`
      );
      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Accept-Language',
      'Content-Language',
      'Content-Type',
      'Authorization',
    ],
  })
);

/*
|--------------------------------------------------------------------------
| Rate Limiter
|--------------------------------------------------------------------------
*/

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

/*
|--------------------------------------------------------------------------
| Request Parsers
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
|--------------------------------------------------------------------------
| Compression
|--------------------------------------------------------------------------
*/

app.use(compression());

/*
|--------------------------------------------------------------------------
| HTTP Logger
|--------------------------------------------------------------------------
*/

app.use(requestLogger);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/v1', ensureDatabaseConnection, routes);

/*
|--------------------------------------------------------------------------
| 404 Middleware
|--------------------------------------------------------------------------
*/

app.use(notFoundMiddleware);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorMiddleware);

export default app;
