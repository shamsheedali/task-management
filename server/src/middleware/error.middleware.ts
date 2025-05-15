import { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import HttpStatus from '../common/constants/httpStatus';
import ResponseMessages from '../common/constants/response';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message: string = ResponseMessages.INTERNAL_SERVER_ERROR;
  let errors: any[] | undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (error instanceof MongoServerError && error.code === 11000) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = ResponseMessages.DUPLICATE_KEY;
  } else if (error.name === 'ValidationError') {
    statusCode = HttpStatus.BAD_REQUEST;
    message = error.message;
  } else if (error.name === 'CastError') {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Invalid ID format';
  } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Invalid JSON format in request body';
  } else {
    logger.error(`Unexpected error: ${error.message}`, {
      error: error.message,
      stack: error.stack,
      path: req.path,
    });
    message = ResponseMessages.INTERNAL_SERVER_ERROR;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
  });
};
