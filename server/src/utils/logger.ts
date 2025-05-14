import { createLogger, format, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const { combine, label, timestamp, printf, colorize } = format;

// Ensure logs directory exists
const LOGS_DIR = path.join(__dirname, '../../logs');
if (!existsSync(LOGS_DIR)) {
  mkdirSync(LOGS_DIR);
}

const ERROR_LOG_PATH = path.join(LOGS_DIR, 'error.log');
const COMBINED_LOG_PATH = path.join(LOGS_DIR, 'combined.log');

const logFormat = printf(
  ({ level, message, label: logLabel, timestamp: logTimestamp }) => {
    return `${logTimestamp} [${logLabel}] ${level}: ${message}`;
  }
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    label({ label: process.env.NODE_ENV || 'development' }),
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.File({ filename: ERROR_LOG_PATH, level: 'error' }),
    new transports.File({ filename: COMBINED_LOG_PATH }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    })
  );
}

export default logger;
