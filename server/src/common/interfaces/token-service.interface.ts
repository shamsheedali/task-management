import { Response } from 'express';

export interface ITokenService {
  generateAccessToken(userId: string): Promise<string>;
  generateRefreshToken(userId: string): Promise<string>;
  setRefreshTokenCookie(res: Response, refreshToken: string): void;
  verifyAccessToken(token: string): { id: string; email: string };
  verifyRefreshToken(refreshToken: string): { id: string; email: string };
}
