import { injectable, inject } from 'inversify';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../../config/env';
import { AppError } from '../../utils/appError';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import { ITokenService } from '../interfaces/token-service.interface';
import logger from '../../utils/logger';
import TYPES from '../../types/inversify.types';
import { IUserRepository } from '../../users/interfaces/user-repository.interface';

@injectable()
export default class TokenService implements ITokenService {
  private _userRepository: IUserRepository;

  constructor(@inject(TYPES.UserRepository) userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async generateAccessToken(userId: string): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return jwt.sign({ id: userId, email: user.email }, env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return jwt.sign({ id: userId, email: user.email }, env.REFRESH_JWT_SECRET, {
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

  verifyAccessToken(token: string): { id: string; email: string } {
    try {
      return jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      logger.error('Access token verification failed:', error);
      throw new AppError(
        ResponseMessages.INVALID_TOKEN,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  verifyRefreshToken(refreshToken: string): { id: string; email: string } {
    try {
      return jwt.verify(refreshToken, env.REFRESH_JWT_SECRET) as {
        id: string;
        email: string;
      };
    } catch (error) {
      logger.error('Refresh token verification failed:', error);
      throw new AppError(
        ResponseMessages.INVALID_TOKEN,
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
