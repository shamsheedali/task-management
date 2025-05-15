import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger';
import { AppError } from './utils/appError';
import ResponseMessages from './common/constants/response';
import { errorMiddleware } from './middleware/error.middleware';
import helmet from 'helmet';
import { limiter } from './middleware/rateLimit.middleware';
import { swaggerServe, swaggerSetup } from './config/swagger';
import userRoutes from './users/user.route';

const app: Express = express();

// Morgan stream to Winston
const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};

// Middleware
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(morgan('combined', { stream: morganStream }));

// Routes
app.use('/api/users', userRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerServe, swaggerSetup);

// 404 Handler
app.use((req: Request, res: Response, next) => {
  next(AppError.notFound(`${ResponseMessages.NOT_FOUND}: ${req.originalUrl}`));
});

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
