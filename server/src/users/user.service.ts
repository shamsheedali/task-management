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
import BaseService from '../common/services/base.service';
import { IUserService } from './interfaces/user-service.interface';

@injectable()
export default class UserService
  extends BaseService<IUser>
  implements IUserService
{
  private _userRepository: IUserRepository;
  private _mailService: IMailService;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.MailService) mailService: IMailService
  ) {
    super(userRepository);
    this._userRepository = userRepository;
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
      teamIds: [], // Initialize teamIds
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
    const user = await super.findById(id);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findAll(): Promise<IUser[]> {
    return this._userRepository.findAll();
  }

  async addTeamToUser(userId: string, teamId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.teamIds.includes(teamId)) {
      throw new AppError(
        'User is already a member of this team',
        HttpStatus.BAD_REQUEST
      );
    }

    await this._userRepository.update(userId, {
      $push: { teamIds: teamId },
    });

    logger.info(`Team ${teamId} added to user: ${userId}`);
  }

  async removeTeamFromUser(userId: string, teamId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!user.teamIds.includes(teamId)) {
      throw new AppError(
        'User is not a member of this team',
        HttpStatus.BAD_REQUEST
      );
    }

    await this._userRepository.update(userId, {
      $pull: { teamIds: teamId },
    });

    logger.info(`Team ${teamId} removed from user: ${userId}`);
  }
}
