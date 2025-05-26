import http from 'http';
import app from './app';
import logger from './utils/logger';
import connectDB from './config/database';
import { env } from './config/env';
import { connectRedis } from './config/redis';
import TYPES from './types/inversify.types';
import { SocketService } from './socket/socket.service';
import container from './config/inversify.config';

const PORT = env.PORT;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    // Initialize SocketService
    const socketService = container.get<SocketService>(TYPES.SocketService);
    socketService.initialize(server);

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
