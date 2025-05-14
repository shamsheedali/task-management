import http from 'http';
import app from './app';
import logger from './utils/logger';
import connectDB from './config/database';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();
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
