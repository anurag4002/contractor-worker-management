import morgan from 'morgan';

import logger from './logger.js';

const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

const requestLogger = morgan(
  ':remote-addr :method :url :status :response-time ms',
  {
    stream,
  }
);

export default requestLogger;