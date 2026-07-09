import fs from 'fs';
import path from 'path';

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import env from '../../config/env.js';

const logDirectory = path.resolve('logs');

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, {
        recursive: true,
    });
}

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),

    winston.format.errors({
        stack: true,
    }),

    winston.format.printf(
        ({ timestamp, level, message, stack }) => {
            return stack
                ? `[${timestamp}] ${level.toUpperCase()}: ${stack}`
                : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        }
    )
);

const consoleTransport = new winston.transports.Console({
    level:
        env.NODE_ENV === 'production'
            ? 'info'
            : 'debug',

    format: winston.format.combine(
        winston.format.colorize(),
        logFormat
    ),
});

const combinedTransport =
    new DailyRotateFile({
        dirname: 'logs/combined',

        filename: '%DATE%.log',

        datePattern: 'YYYY-MM-DD',

        maxFiles: '30d',

        zippedArchive: true,

        level: 'info',
    });

const errorTransport =
    new DailyRotateFile({
        dirname: 'logs/error',

        filename: '%DATE%.log',

        datePattern: 'YYYY-MM-DD',

        maxFiles: '60d',

        zippedArchive: true,

        levels: {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
},

level:
  env.NODE_ENV === 'production'
    ? 'info'
    : 'debug',
    });

const logger = winston.createLogger({
    level: 'info',

    format: logFormat,

    transports: [
        consoleTransport,
        combinedTransport,
        errorTransport,
    ],

    exitOnError: false,
});

export default logger;