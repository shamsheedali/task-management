import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import logger from './utils/logger';
import { AppError } from './utils/appError';
import ResponseMessages from './common/constants/response';
import { errorMiddleware } from './middleware/error.middleware';
import helmet from 'helmet';
// import { limiter } from './middleware/rateLimit.middleware';
import { swaggerServe, swaggerSetup } from './config/swagger';
import cookieParser from 'cookie-parser';
import userRoutes from './users/user.route';
import taskListRoutes from './tasks/routes/taskList.route';
import taskRoutes from './tasks/routes/task.routes';
import teamRoutes from './team/routes/team.routes';
import teamTaskRoutes from './team/routes/teamTask.routes';
import notificationRoutes from './team/routes/notification.routes';

const app: Express = express();

// Morgan stream to Winston
const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};

// Middleware
app.use(cors());
app.use(helmet());
// app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined', { stream: morganStream }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasklist', taskListRoutes);
app.use('/api/tasklist', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/teams', teamTaskRoutes);
app.use('/api/teams', notificationRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerServe, swaggerSetup);

// 404 Handler
app.use((req: Request, res: Response, next) => {
  next(AppError.notFound(`${ResponseMessages.NOT_FOUND}: ${req.originalUrl}`));
});

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
