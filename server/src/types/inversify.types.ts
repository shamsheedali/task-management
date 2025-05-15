const TYPES = {
  //Models
  UserModel: Symbol.for('UserModel'),
  //Repositories
  UserRepository: Symbol.for('UserRepository'),
  //Services
  UserService: Symbol.for('UserService'),
  TokenService: Symbol.for('TokenService'),
  MailService: Symbol.for('MailService'),
  //Controllers
  UserController: Symbol.for('UserController'),
};

export default TYPES;
