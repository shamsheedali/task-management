import { createClient } from 'redis';
import log from '../utils/logger';
import { env } from './env';

const redisClient = createClient({
  url: env.REDIS_URL,
  password: env.REDIS_PASSWORD,
});

redisClient.on('error', err => log.info('Redis Client Error', err));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    log.info('Connected to Redis Cloud!');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
};

export default redisClient;
