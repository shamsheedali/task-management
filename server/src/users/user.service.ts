import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import TYPES from '../types/inversify.types';
import { RegisterInput, LoginInput } from './user.validator';
import { IUser } from './user.model';
import { IUserRepository } from './interfaces/user-repository.interface';
import { AppError } from '../utils/appError';
import ResponseMessages from '../common/constants/response';
import HttpStatus from '../common/constants/httpStatus';
import { IUserService } from './interfaces/user-service.interface';

@injectable()
export default class UserService implements IUserService {
  private _userRepository: IUserRepository;

  constructor(@inject(TYPES.UserRepository) repository: IUserRepository) {
    this._userRepository = repository;
  }

  async registerUser(dto: RegisterInput): Promise<IUser> {
    const existingUser = await this._userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError(
        ResponseMessages.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
        true
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this._userRepository.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
    });

    return user;
  }

  async loginUser(dto: LoginInput): Promise<IUser> {
    const user = await this._userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError(
        ResponseMessages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
        true
      );
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new AppError(
        ResponseMessages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
        true
      );
    }

    return user;
  }
}
