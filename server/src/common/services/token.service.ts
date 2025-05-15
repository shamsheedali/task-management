import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../../config/env';

@injectable()
export default class TokenService {
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
}
