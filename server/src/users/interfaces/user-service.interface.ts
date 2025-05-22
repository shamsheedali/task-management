import { RegisterInput, LoginInput } from '../user.validator';
import { IUser } from '../user.model';

export interface IUserService {
  initiateRegistration(dto: RegisterInput): Promise<void>;
  verifyAndRegister(email: string, otp: string): Promise<IUser>;
  loginUser(dto: LoginInput): Promise<IUser>;
  findById(id: string): Promise<IUser>;
  addTeamToUser(userId: string, teamId: string): Promise<void>;
  removeTeamFromUser(userId: string, teamId: string): Promise<void>;
}
