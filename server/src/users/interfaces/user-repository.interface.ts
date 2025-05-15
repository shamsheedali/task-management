import { IUser } from '../user.model';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(user: {
    username: string;
    email: string;
    passwordHash: string;
  }): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
}
