import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from '../utils/appError';
import HttpStatus from '../common/constants/httpStatus';

export const validate = (schema: z.ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new AppError(
          'Validation failed',
          HttpStatus.BAD_REQUEST,
          true,
          errors
        );
      }
      throw new AppError('Invalid request data', HttpStatus.BAD_REQUEST);
    }
  };
};
