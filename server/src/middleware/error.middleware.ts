import { Request, Response, NextFunction } from 'express';
import HttpStatus from '../common/constants/httpStatus';
import ResponseMessages from '../common/constants/response';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message: string = ResponseMessages.ERROR;

  if (error instanceof AppError) {
    // Handle custom AppError
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    // Handle Mongoose validation errors
    statusCode = HttpStatus.BAD_REQUEST;
    message = error.message;
  } else if (error.name === 'CastError') {
    // Handle Mongoose invalid ObjectId
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Invalid ID format';
  }

  // Log non-operational errors (e.g., programming errors)
  if (!(error instanceof AppError) || !error.isOperational) {
    logger.error(`Unexpected error: ${error.message}`, {
      error,
      path: req.path,
    });
  }

  // Send standardized response
  res.status(statusCode).json({
    status: 'error',
    message,
  });
};
