import { inject, injectable } from 'inversify';
import { Response } from 'express';
import TYPES from '../types/inversify.types';
import { toUserResponseDTO, UserResponseDTO } from './user.dto';
import ResponseMessages from '../common/constants/response';
import HttpStatus from '../common/constants/httpStatus';
import UserService from './user.service';
import TokenService from '../common/services/token.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/appError';

@injectable()
export default class UserController {
  private _userService: UserService;
  private _tokenService: TokenService;

  constructor(
    @inject(TYPES.UserService) userService: UserService,
    @inject(TYPES.TokenService) tokenService: TokenService
  ) {
    this._userService = userService;
    this._tokenService = tokenService;
  }

  async register(req: AuthRequest, res: Response) {
    await this._userService.initiateRegistration(req.body);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'OTP sent to email. Please verify to complete registration.',
    });
  }

  async verifyAndRegister(req: AuthRequest, res: Response) {
    const user = await this._userService.verifyAndRegister(
      req.body.email,
      req.body.otp
    );
    const accessToken = this._tokenService.generateAccessToken(user._id);
    const refreshToken = this._tokenService.generateRefreshToken(user._id);
    this._tokenService.setRefreshTokenCookie(res, refreshToken);

    const userDTO: UserResponseDTO = toUserResponseDTO(user);
    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: ResponseMessages.USER_CREATION_SUCCESS,
      data: userDTO,
      accessToken,
    });
  }

  async login(req: AuthRequest, res: Response) {
    const user = await this._userService.loginUser(req.body);
    const accessToken = this._tokenService.generateAccessToken(user._id);
    const refreshToken = this._tokenService.generateRefreshToken(user._id);
    this._tokenService.setRefreshTokenCookie(res, refreshToken);

    const userDTO: UserResponseDTO = toUserResponseDTO(user);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: ResponseMessages.LOGIN_SUCCESS,
      data: userDTO,
      accessToken,
    });
  }

  async getProfile(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const user = await this._userService.findById(userId);
    const userDTO: UserResponseDTO = toUserResponseDTO(user);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'User profile retrieved successfully',
      data: userDTO,
    });
  }

  async refreshToken(req: AuthRequest, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenService.generateAccessToken(decoded.id);

    // Optionally rotate refresh token for enhanced security
    const newRefreshToken = this._tokenService.generateRefreshToken(decoded.id);
    this._tokenService.setRefreshTokenCookie(res, newRefreshToken);

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Token refreshed successfully',
      accessToken,
    });
  }
}
