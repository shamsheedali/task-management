import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import redisClient from '../config/redis';
import TYPES from '../types/inversify.types';
import { RegisterInput, LoginInput } from './user.validator';
import { IUser } from './user.model';
import { IUserRepository } from './interfaces/user-repository.interface';
import { IMailService } from '../common/interfaces/mail-service.interface';
import { AppError } from '../utils/appError';
import ResponseMessages from '../common/constants/response';
import HttpStatus from '../common/constants/httpStatus';
import { env } from '../config/env';
import logger from '../utils/logger';

@injectable()
export default class UserService {
  private _userRepository: IUserRepository;
  private _mailService: IMailService;

  constructor(
    @inject(TYPES.UserRepository) repository: IUserRepository,
    @inject(TYPES.MailService) mailService: IMailService
  ) {
    this._userRepository = repository;
    this._mailService = mailService;
  }

  async initiateRegistration(dto: RegisterInput): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError(
        ResponseMessages.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const mailOptions = {
      from: env.EMAIL_USER || '',
      to: dto.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    };

    try {
      const pendingUserKey = `pending:user:${dto.email}`;
      await redisClient.set(pendingUserKey, JSON.stringify(dto), { EX: 300 });
      await this._mailService.sendMail(mailOptions);
      await redisClient.set(`otp:${dto.email}`, otp, { EX: 300 });
      logger.info(`OTP sent to ${dto.email}: ${otp}`);
    } catch (error) {
      logger.error('Failed to initiate registration', {
        error: (error as Error).message,
      });
      throw new AppError(
        'Failed to send OTP',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async verifyAndRegister(email: string, otp: string): Promise<IUser> {
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp) {
      throw new AppError('OTP not found or expired', HttpStatus.BAD_REQUEST);
    }

    if (otp !== storedOtp) {
      throw new AppError('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    const pendingUserKey = `pending:user:${email}`;
    const pendingUserData = await redisClient.get(pendingUserKey);
    if (!pendingUserData) {
      throw new AppError('No pending user data found', HttpStatus.BAD_REQUEST);
    }

    const {
      username,
      email: storedEmail,
      password,
    } = JSON.parse(pendingUserData);
    if (email !== storedEmail) {
      throw new AppError('Email mismatch', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(
        ResponseMessages.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this._userRepository.create({
      username,
      email,
      passwordHash,
    });

    await redisClient.del(`otp:${email}`);
    await redisClient.del(pendingUserKey);

    return user;
  }

  async loginUser(dto: LoginInput): Promise<IUser> {
    const user = await this._userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError(
        ResponseMessages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED
      );
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new AppError(
        ResponseMessages.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED
      );
    }

    return user;
  }

  async findById(id: string): Promise<IUser> {
    const user = await this._userRepository.findById(id);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
