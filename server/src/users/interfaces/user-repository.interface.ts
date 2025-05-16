import { IBaseRepository } from '../../common/interfaces/base-repository.interface';
import { IUser } from '../user.model';
import { UpdateQuery } from 'mongoose';

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, data: UpdateQuery<IUser>): Promise<IUser | null>;
}
