import env from './env.js';

const serverConfig = {
  PORT: env.PORT,

  API_PREFIX: env.API_PREFIX,

  REQUEST_TIMEOUT: 30000,

  BODY_LIMIT: '10mb',

  RATE_LIMIT: {
    WINDOW_MS: env.RATE_LIMIT_WINDOW_MS,
    MAX_REQUESTS: env.RATE_LIMIT_MAX_REQUESTS,
  },

  CORS: {
    ORIGIN: env.CLIENT_URL,
    CREDENTIALS: true,
  },

  HELMET: {
    CONTENT_SECURITY_POLICY: false,
  },

  COMPRESSION_LEVEL: 6,
};

export default serverConfig;