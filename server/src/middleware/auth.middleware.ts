import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/appError';
import ResponseMessages from '../common/constants/response';
import HttpStatus from '../common/constants/httpStatus';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new AppError(ResponseMessages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
    };
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    logger.error('Access token verification failed:', error);
    throw new AppError(ResponseMessages.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
  }
};
