import mongoose from 'mongoose';

import env from '../config/env.js';
import logger from '../common/logger/logger.js';

/**
 * Connect MongoDB
 */
const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
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