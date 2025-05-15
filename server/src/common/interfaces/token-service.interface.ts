import { Response } from 'express';

export interface ITokenService {
  generateAccessToken(userId: string): string;
  generateRefreshToken(userId: string): string;
  setRefreshTokenCookie(res: Response, refreshToken: string): void;
  verifyRefreshToken(refreshToken: string): { id: string };
}
