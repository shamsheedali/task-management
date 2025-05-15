const enum ResponseMessages {
  SUCCESS = 'Operation successful',
  ERROR = 'An error occurred',
  NOT_FOUND = 'Resource not found',
  BAD_REQUEST = 'Invalid request data',
  UNAUTHORIZED = 'Unauthorized access',
  CREATED = 'Resource created successfully',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  USER_ALREADY_EXISTS = 'User already exists',
  INVALID_CREDENTIALS = 'Invalid email or password',
  USER_CREATION_SUCCESS = 'User created successfully',
  LOGIN_SUCCESS = 'Login successful',
  DUPLICATE_KEY = 'Duplicate key error',
  INVALID_TOKEN = 'Invalid token',
}

export default ResponseMessages;
