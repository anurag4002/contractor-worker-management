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

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

const allowedOrigins = [
  env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
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
  return allowedOrigins.some(
    (allowed) => normalizeOrigin(allowed) === normalizedOrigin
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);
      const allowed = !origin || isOriginAllowed(origin);
      if (allowed) {
        const requestOrigin = origin || '(undefined)';
        const clientUrl = env.CLIENT_URL || '(undefined)';
        logger.info(`[CORS DEBUG] requestOrigin=${requestOrigin} clientUrl=${clientUrl} isAllowed=true`);
        callback(null, true);
      } else {
        const requestOrigin = origin || '(undefined)';
        const clientUrl = env.CLIENT_URL || '(undefined)';
        const vercelUrl = process.env.VERCEL_URL || '(undefined)';
        const allowedOriginsList = allowedOrigins.map(normalizeOrigin).join(' | ');
        const rejectionMessage = `[CORS DEBUG] requestOrigin=${requestOrigin} normalizedRequestOrigin=${normalizedOrigin} clientUrl=${clientUrl} normalizedClientUrl=${normalizeOrigin(clientUrl)} vercelUrl=${vercelUrl} normalizedVercelUrl=${vercelUrl !== '(undefined)' ? normalizeOrigin('https://' + vercelUrl) : '(undefined)'} allowedOrigins=${allowedOriginsList} isAllowed=false`;
        logger.warn(rejectionMessage);
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
