import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import TYPES from '../types/inversify.types';
import { IUser } from './user.model';
import BaseRepository from '../common/repositories/base.repository';
import { IUserRepository } from './interfaces/user-repository.interface';

@injectable()
export default class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor(@inject(TYPES.UserModel) userModel: Model<IUser>) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async create(user: {
    username: string;
    email: string;
    passwordHash: string;
  }): Promise<IUser> {
    return this.model.create(user);
  }

  async findById(id: string): Promise<IUser | null> {
    return this.model.findById(id).exec();
  }
}
