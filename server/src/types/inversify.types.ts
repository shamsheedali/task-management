const TYPES = {
  // Models
  UserModel: Symbol.for('UserModel'),
  TaskListModel: Symbol.for('TaskListModel'),
  TaskModel: Symbol.for('TaskModel'),
  TeamModel: Symbol.for('TeamModel'),
  TeamTaskModel: Symbol.for('TeamTaskModel'),
  NotificationModel: Symbol.for('NotificationModel'),
  // Controllers
  UserController: Symbol.for('UserController'),
  TaskListController: Symbol.for('TaskListController'),
  TaskController: Symbol.for('TaskController'),
  TeamController: Symbol.for('TeamController'),
  TeamTaskController: Symbol.for('TeamTaskController'),
  NotificationController: Symbol.for('NotificationController'),
  // Services
  UserService: Symbol.for('UserService'),
  TokenService: Symbol.for('TokenService'),
  MailService: Symbol.for('MailService'),
  TaskListService: Symbol.for('TaskListService'),
  TaskService: Symbol.for('TaskService'),
  TeamService: Symbol.for('TeamService'),
  TeamTaskService: Symbol.for('TeamTaskService'),
  NotificationService: Symbol.for('NotificationService'),
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  TaskListRepository: Symbol.for('TaskListRepository'),
  TaskRepository: Symbol.for('TaskRepository'),
  TeamRepository: Symbol.for('TeamRepository'),
  TeamTaskRepository: Symbol.for('TeamTaskRepository'),
  NotificationRepository: Symbol.for('NotificationRepository'),
};

export default TYPES;
