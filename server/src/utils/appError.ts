import HttpStatus from '../common/constants/httpStatus';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for common errors
  static badRequest(message: string): AppError {
    return new AppError(message, HttpStatus.BAD_REQUEST);
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
