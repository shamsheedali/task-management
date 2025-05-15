import { Container } from 'inversify';
import TYPES from '../types/inversify.types';
import TokenService from '../common/services/token.service';
import { Model } from 'mongoose';
import { IUser } from '../users/user.model';
import UserController from '../users/user.controller';
import UserService from '../users/user.service';
import UserRepository from '../users/user.repository';
import { User } from '../users/user.model';

const container = new Container();

// Bind Models
container.bind<Model<IUser>>(TYPES.UserModel).toConstantValue(User);

// Bind Controllers
container
  .bind<UserController>(TYPES.UserController)
  .to(UserController)
  .inSingletonScope();

// Bind Services
container
  .bind<UserService>(TYPES.UserService)
  .to(UserService)
  .inSingletonScope();
container
  .bind<TokenService>(TYPES.TokenService)
  .to(TokenService)
  .inSingletonScope();

// Bind Repositories
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();

export default container;
