import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../types/inversify.types';
import { RegisterInput, LoginInput, VerifyOtpInput } from './user.validator';
import { toUserResponseDTO, UserResponseDTO } from './user.dto';
import ResponseMessages from '../common/constants/response';
import HttpStatus from '../common/constants/httpStatus';
import UserService from './user.service';
import TokenService from '../common/services/token.service';

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

  async register(req: Request<{}, {}, RegisterInput>, res: Response) {
    await this._userService.initiateRegistration(req.body);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'OTP sent to email. Please verify to complete registration.',
    });
  }

  async verifyAndRegister(req: Request<{}, {}, VerifyOtpInput>, res: Response) {
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

  async login(req: Request<{}, {}, LoginInput>, res: Response) {
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
}
