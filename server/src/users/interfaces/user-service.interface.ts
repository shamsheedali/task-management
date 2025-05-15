import { RegisterInput, LoginInput } from '../user.validator';
import { IUser } from '../user.model';

export interface IUserService {
  registerUser(dto: RegisterInput): Promise<IUser>;
  loginUser(dto: LoginInput): Promise<IUser>;
}
