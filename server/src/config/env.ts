import dotenv from 'dotenv';
import { cleanEnv, port, str, url, num } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  MONGO_URI: url(),
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  LOG_LEVEL: str({
    choices: ['error', 'warn', 'info', 'debug'],
    default: 'info',
  }),
  JWT_SECRET: str(),
  REFRESH_JWT_SECRET: str(),
  REFRESH_JWT_MAX_AGE: num({ default: 7 * 24 * 60 * 60 * 1000 }),
  REDIS_URL: str(),
  REDIS_PASSWORD: str(),
  EMAIL_USER: str(),
  EMAIL_PASS: str(),
  INVITE_EXPIRY_MS: num({ default: 24 * 60 * 60 * 1000 }), // 24 hours in milliseconds
  CORS_ORIGIN: url({ default: 'http://localhost:5173' }),
});
