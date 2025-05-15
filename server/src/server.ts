import http from 'http';
import app from './app';
import logger from './utils/logger';
import connectDB from './config/database';
import { env } from './config/env';
import { connectRedis } from './config/redis';

const PORT = env.PORT;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', {
      error: (error as Error).message,
    });
    process.exit(1);
  }
};

startServer();
