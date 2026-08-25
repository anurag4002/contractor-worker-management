import mongoose from 'mongoose';

import env from '../config/env.js';
import logger from '../common/logger/logger.js';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDatabase = async (retryCount = 0) => {
  try {
    if (retryCount > 0) {
      logger.info(`MongoDB connection retry attempt ${retryCount}/${MAX_RETRIES}...`);
    }

    const connection = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });

    logger.info(
      `MongoDB Connected: ${connection.connection.host}`
    );

    mongoose.connection.on('error', (error) => {
      logger.error(`MongoDB Error: ${error.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB Disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB Reconnected');
    });

    return connection;
  } catch (error) {
    logger.error(
      `MongoDB Connection Failed: ${error.message}`
    );

    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying MongoDB connection in ${RETRY_DELAY / 1000} seconds...`);
      await sleep(RETRY_DELAY);
      return connectDatabase(retryCount + 1);
    }

    logger.error(
      'MongoDB connection failed after maximum retries. Please check:'
    );
    logger.error('1. MongoDB Atlas IP whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/');
    logger.error('2. Database user credentials');
    logger.error('3. Network connectivity');
    logger.error('4. Cluster status in Atlas dashboard');

    process.exit(1);
  }
};

/**
 * Disconnect MongoDB
 */
export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();

    logger.info('MongoDB Connection Closed');
  } catch (error) {
    logger.error(
      `Error closing MongoDB connection: ${error.message}`
    );
  }
};

export default connectDatabase;