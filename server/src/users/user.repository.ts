import { inject, injectable } from 'inversify';
import { Model } from 'mongoose';
import TYPES from '../types/inversify.types';
import { IUserRepository } from './interfaces/user-repository.interface';
import { IUser } from './user.model';
import { UpdateQuery } from 'mongoose';
import BaseRepository from '../common/repositories/base.repository';

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

  async update(id: string, data: UpdateQuery<IUser>): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
