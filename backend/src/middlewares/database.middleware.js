import mongoose from 'mongoose';
import connectDatabase from '../database/mongodb.js';

let connectionPromise = null;

const ensureDatabaseConnection = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    if (!connectionPromise) {
      connectionPromise = connectDatabase().catch((error) => {
        connectionPromise = null;
        throw error;
      });
    }

    await connectionPromise;
    next();
  } catch (error) {
    next(error);
  }
};

export default ensureDatabaseConnection;
