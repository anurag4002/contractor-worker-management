import dotenv from 'dotenv';

dotenv.config();

const normalizeMongoDbUri = (uri) => {
  if (!uri) {
    return uri;
  }

  try {
    const parsedUri = new URL(uri);
    const databaseName = decodeURIComponent(
      parsedUri.pathname.slice(1)
    );

    if (!databaseName) {
      return uri;
    }

    const normalizedDatabaseName = databaseName
      .trim()
      .replace(/\s+/g, '-');

    if (normalizedDatabaseName === databaseName) {
      return uri;
    }

    parsedUri.pathname = `/${normalizedDatabaseName}`;

    return parsedUri.toString();
  } catch {
    return uri;
  }
};

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  PORT: Number(process.env.PORT) || 5000,

  API_PREFIX: process.env.API_PREFIX || '/api/v1',

  MONGODB_URI: normalizeMongoDbUri(
    process.env.MONGODB_URI
  ),

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN,

  CLIENT_URL: process.env.CLIENT_URL?.trim().replace(/\/+$/, ''),

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,

  BCRYPT_SALT_ROUNDS:
    Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  RATE_LIMIT_WINDOW_MS:
    Number(process.env.RATE_LIMIT_WINDOW_MS) ||
    15 * 60 * 1000,

  RATE_LIMIT_MAX_REQUESTS:
    Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
};

if (env.NODE_ENV !== 'production') {
  console.info('[ENV DEBUG]', {
    JWT_SECRET_SET: !!env.JWT_SECRET,
    JWT_SECRET_LENGTH: env.JWT_SECRET?.length || 0,
    JWT_REFRESH_SECRET_SET: !!env.JWT_REFRESH_SECRET,
    JWT_REFRESH_SECRET_LENGTH: env.JWT_REFRESH_SECRET?.length || 0,
    JWT_EXPIRES_IN: env.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export default env;
