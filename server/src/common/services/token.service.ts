import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../../config/env';
import { AppError } from '../../utils/appError';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import { ITokenService } from '../interfaces/token-service.interface';
import logger from '../../utils/logger';

@injectable()
export default class TokenService implements ITokenService {
  generateAccessToken(userId: string): string {
    return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '1h' });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, env.REFRESH_JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      maxAge: env.REFRESH_JWT_MAX_AGE,
    });
  }

  verifyRefreshToken(refreshToken: string): { id: string } {
    try {
      return jwt.verify(refreshToken, env.REFRESH_JWT_SECRET) as { id: string };
    } catch (error) {
      logger.error('Refresh token verification failed:', error);
      throw new AppError(
        ResponseMessages.INVALID_TOKEN,
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
