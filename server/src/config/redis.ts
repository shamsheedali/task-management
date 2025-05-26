import { createClient } from 'redis';
import log from '../utils/logger';
import { env } from './env';

const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: retries => Math.min(retries * 50, 2000), // Retry with backoff
    connectTimeout: 10000, // 10s timeout
  },
});

redisClient.on('error', err => {
  log.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  log.info('Connected to Redis Cloud!');
});

redisClient.on('reconnecting', () => {
  log.info('Reconnecting to Redis...');
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      // No explicit log here; 'connect' event handles it
    }
  } catch (error) {
    log.error('Redis Connection Failed:', error);
    throw error; // Rethrow to allow caller to handle
  }
};

export default redisClient;
