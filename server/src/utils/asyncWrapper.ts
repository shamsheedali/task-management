import { Request, Response, NextFunction } from 'express';
import { AppError } from './appError';
import HttpStatus from '../common/constants/httpStatus';
import logger from './logger';

export const asyncWrap = (
  controller: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res, next).catch((error: any) => {
      if (error instanceof AppError) {
        next(error);
      } else {
        const wrappedError = new AppError(
          error.message || 'Unknown error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
          false
        );
        logger.error('Unhandled controller error', {
          error: error.message,
          stack: error.stack,
          path: req.path,
        });
        next(wrappedError);
      }
    });
  };
};
