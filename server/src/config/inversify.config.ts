import { Container } from 'inversify';
import TYPES from '../types/inversify.types';
import { Model } from 'mongoose';
import { IUser, User } from '../users/user.model';
import { ITaskList, TaskList } from '../tasks/models/taskList.model';
import UserController from '../users/user.controller';
import TaskListController from '../tasks/controllers/taskList.controller';
import UserService from '../users/user.service';
import TokenService from '../common/services/token.service';
import MailService from '../common/services/mail.service';
import TaskListService from '../tasks/services/taskList.service';
import UserRepository from '../users/user.repository';
import TaskListRepository from '../tasks/repositories/taskList.repository';
import { ITask, Task } from '../tasks/models/task.model';
import TaskController from '../tasks/controllers/task.controller';
import TaskService from '../tasks/services/task.service';
import TaskRepository from '../tasks/repositories/task.repository';

const container = new Container();

// Bind Models
container.bind<Model<IUser>>(TYPES.UserModel).toConstantValue(User);
container.bind<Model<ITaskList>>(TYPES.TaskListModel).toConstantValue(TaskList);
container.bind<Model<ITask>>(TYPES.TaskModel).toConstantValue(Task);

// Bind Controllers
container
  .bind<UserController>(TYPES.UserController)
  .to(UserController)
  .inSingletonScope();
container
  .bind<TaskListController>(TYPES.TaskListController)
  .to(TaskListController)
  .inSingletonScope();
container
  .bind<TaskController>(TYPES.TaskController)
  .to(TaskController)
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
container
  .bind<MailService>(TYPES.MailService)
  .to(MailService)
  .inSingletonScope();
container
  .bind<TaskListService>(TYPES.TaskListService)
  .to(TaskListService)
  .inSingletonScope();
container
  .bind<TaskService>(TYPES.TaskService)
  .to(TaskService)
  .inSingletonScope();

// Bind Repositories
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<TaskListRepository>(TYPES.TaskListRepository)
  .to(TaskListRepository)
  .inSingletonScope();
container
  .bind<TaskRepository>(TYPES.TaskRepository)
  .to(TaskRepository)
  .inSingletonScope();

export default container;
