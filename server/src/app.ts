import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger';

const app: Express = express();

// Morgan stream to Winston
const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: morganStream }));

export default app;
