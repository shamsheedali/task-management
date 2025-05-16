const TYPES = {
  //Models
  UserModel: Symbol.for('UserModel'),
  TaskListModel: Symbol.for('TaskListModel'),
  //Controllers
  UserController: Symbol.for('UserController'),
  TaskListController: Symbol.for('TaskListController'),
  //Services
  UserService: Symbol.for('UserService'),
  TokenService: Symbol.for('TokenService'),
  MailService: Symbol.for('MailService'),
  TaskListService: Symbol.for('TaskListService'),
  //Repositories
  UserRepository: Symbol.for('UserRepository'),
  TaskListRepository: Symbol.for('TaskListRepository'),
};

export default TYPES;
