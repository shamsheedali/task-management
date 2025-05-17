const TYPES = {
  //Models
  UserModel: Symbol.for('UserModel'),
  TaskListModel: Symbol.for('TaskListModel'),
  TaskModel: Symbol.for('TaskModel'),
  //Controllers
  UserController: Symbol.for('UserController'),
  TaskListController: Symbol.for('TaskListController'),
  TaskController: Symbol.for('TaskController'),
  //Services
  UserService: Symbol.for('UserService'),
  TokenService: Symbol.for('TokenService'),
  MailService: Symbol.for('MailService'),
  TaskListService: Symbol.for('TaskListService'),
  TaskService: Symbol.for('TaskService'),
  //Repositories
  UserRepository: Symbol.for('UserRepository'),
  TaskListRepository: Symbol.for('TaskListRepository'),
  TaskRepository: Symbol.for('TaskRepository'),
};

export default TYPES;
