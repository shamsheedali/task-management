import HttpStatus from '../common/constants/httpStatus';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: any[];

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    errors?: any[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: any[]): AppError {
    return new AppError(message, HttpStatus.BAD_REQUEST, true, errors);
  }

  static unauthorized(message: string): AppError {
    return new AppError(message, HttpStatus.UNAUTHORIZED);
  }

  static notFound(message: string): AppError {
    return new AppError(message, HttpStatus.NOT_FOUND);
  }

  static internal(message: string): AppError {
    return new AppError(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
