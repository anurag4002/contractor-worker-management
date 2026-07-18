import http from 'http';

import app from './src/app.js';

import env from './src/config/env.js';
import serverConfig from './src/config/server.js';

import connectDatabase, {
    disconnectDatabase,
} from './src/database/mongodb.js';

import logger from './src/common/logger/logger.js';

let server;

/**
 * Start Server
 */
const startServer = async () => {
    try {
        // Connect Database
        await connectDatabase();

        // Create HTTP Server
        server = http.createServer(app);

        // Start Listening
        server.listen(serverConfig.PORT, () => {
            logger.info(
                `Server started successfully`
            );

            logger.info(
                `Environment : ${env.NODE_ENV}`
            );

            logger.info(
                `Port        : ${serverConfig.PORT}`
            );

            logger.info(
                `API Prefix  : ${serverConfig.API_PREFIX}`
            );

            logger.info(
                `Server URL  : http://localhost:${serverConfig.PORT}${serverConfig.API_PREFIX}`
            );
        });

        /**
 * Server Timeouts
 */
        server.requestTimeout =
            serverConfig.REQUEST_TIMEOUT;

        server.headersTimeout =
            serverConfig.REQUEST_TIMEOUT + 5000;

        server.keepAliveTimeout = 5000;

        /**
 * Server Errors
 */
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger.error(
                    `Port ${serverConfig.PORT} is already in use.`
                );

                process.exit(1);
            }

            logger.error(
                `HTTP Server Error: ${error.message}`
            );

            process.exit(1);
        });
    } catch (error) {
        logger.error(
            `Application Startup Failed: ${error.stack}`
        );

        process.exit(1);
    }
};

/**
 * Graceful Shutdown
 */
const gracefulShutdown = async (signal) => {
    try {
        logger.info(
            `${signal} received. Closing application...`
        );
        /**
 * Force Shutdown after 10 seconds
 */
        const shutdownTimeout = setTimeout(() => {
            logger.error(
                'Graceful shutdown timed out. Forcefully exiting...'
            );

            process.exit(1);
        }, 10000);

        if (server) {
            server.close(async () => {
                clearTimeout(shutdownTimeout);

                logger.info('HTTP Server Closed');

                await disconnectDatabase();

                logger.info('Application Shutdown Completed');

                process.exit(0);
            });
        } else {
            await disconnectDatabase();

            process.exit(0);
        }
    } catch (error) {
        logger.error(
            `Shutdown Error: ${error.message}`
        );

        process.exit(1);
    }
};

/**
 * Process Events
 */

process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
    logger.error(
        `Uncaught Exception:\n${error.stack}`
    );

    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error(
        `Unhandled Rejection:\n${reason}`
    );

    process.exit(1);
});

/**
 * Start Application
 */
startServer();