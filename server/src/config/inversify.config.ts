import { Container } from 'inversify';
import TYPES from '../types/inversify.types';
import { Model } from 'mongoose';
import { IUser, User } from '../users/user.model';
import { ITaskList, TaskList } from '../tasks/models/taskList.model';
import { ITask, Task } from '../tasks/models/task.model';
import { ITeam, Team } from '../team/models/team.model';
import { ITeamTask, TeamTask } from '../team/models/teamTask.model';
import { INotification, Notification } from '../team/models/notification.model';
import UserController from '../users/user.controller';
import TaskListController from '../tasks/controllers/taskList.controller';
import TaskController from '../tasks/controllers/task.controller';
import TeamController from '../team/controllers/team.controller';
import TeamTaskController from '../team/controllers/teamTask.controller';
import NotificationController from '../team/controllers/notification.controller';
import UserService from '../users/user.service';
import TokenService from '../common/services/token.service';
import MailService from '../common/services/mail.service';
import TaskListService from '../tasks/services/taskList.service';
import TaskService from '../tasks/services/task.service';
import TeamService from '../team/services/team.service';
import TeamTaskService from '../team/services/teamTask.service';
import NotificationService from '../team/services/notification.service';
import UserRepository from '../users/user.repository';
import TaskListRepository from '../tasks/repositories/taskList.repository';
import TaskRepository from '../tasks/repositories/task.repository';
import TeamRepository from '../team/repositories/team.repository';
import TeamTaskRepository from '../team/repositories/teamTask.repository';
import NotificationRepository from '../team/repositories/notification.repository';

const container = new Container();

// Bind Models
container.bind<Model<IUser>>(TYPES.UserModel).toConstantValue(User);
container.bind<Model<ITaskList>>(TYPES.TaskListModel).toConstantValue(TaskList);
container.bind<Model<ITask>>(TYPES.TaskModel).toConstantValue(Task);
container.bind<Model<ITeam>>(TYPES.TeamModel).toConstantValue(Team);
container.bind<Model<ITeamTask>>(TYPES.TeamTaskModel).toConstantValue(TeamTask);
container
  .bind<Model<INotification>>(TYPES.NotificationModel)
  .toConstantValue(Notification);

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
container
  .bind<TeamController>(TYPES.TeamController)
  .to(TeamController)
  .inSingletonScope();
container
  .bind<TeamTaskController>(TYPES.TeamTaskController)
  .to(TeamTaskController)
  .inSingletonScope();
container
  .bind<NotificationController>(TYPES.NotificationController)
  .to(NotificationController)
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
container
  .bind<TeamService>(TYPES.TeamService)
  .to(TeamService)
  .inSingletonScope();
container
  .bind<TeamTaskService>(TYPES.TeamTaskService)
  .to(TeamTaskService)
  .inSingletonScope();
container
  .bind<NotificationService>(TYPES.NotificationService)
  .to(NotificationService)
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
container
  .bind<TeamRepository>(TYPES.TeamRepository)
  .to(TeamRepository)
  .inSingletonScope();
container
  .bind<TeamTaskRepository>(TYPES.TeamTaskRepository)
  .to(TeamTaskRepository)
  .inSingletonScope();
container
  .bind<NotificationRepository>(TYPES.NotificationRepository)
  .to(NotificationRepository)
  .inSingletonScope();

export default container;
