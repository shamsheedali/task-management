import { Server, Socket } from 'socket.io';
import { injectable, inject } from 'inversify';
import TYPES from '../types/inversify.types';
import type { ITokenService } from '../common/interfaces/token-service.interface';
import logger from '../utils/logger';
import { env } from '../config/env';

@injectable()
export class SocketService {
  private io: Server | null = null;

  constructor(
    @inject(TYPES.TokenService) private tokenService: ITokenService
  ) {}

  public initialize(httpServer: any): void {
    if (!httpServer) {
      throw new Error('HTTP server is required to initialize Socket.IO');
    }
    this.io = new Server(httpServer, {
      cors: {
        origin: env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000, // 60 seconds
      pingInterval: 25000, // 25 seconds
      maxHttpBufferSize: 1e6, // 1MB
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      },
    });
    this.setupAuthentication();
    this.setupConnection();
    logger.info('Socket.IO server initialized');
  }

  private setupAuthentication(): void {
    if (!this.io) {
      throw new Error('Socket.IO server not initialized');
    }
    this.io.use((socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token?.replace('Bearer ', '');
        if (!token) {
          throw new Error('Authentication token missing');
        }
        const payload = this.tokenService.verifyAccessToken(token);
        if (!payload.id || !payload.email) {
          throw new Error('Invalid token payload');
        }
        socket.data.userId = payload.id;
        socket.data.email = payload.email;
        logger.info('Socket authenticated', {
          userId: payload.id,
          email: payload.email,
        });
        next();
      } catch (error) {
        logger.error('Socket authentication failed:', {
          error: (error as Error).message,
          tokenLength: socket.handshake.auth.token?.length,
        });
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupConnection(): void {
    if (!this.io) {
      throw new Error('Socket.IO server not initialized');
    }
    this.io.on('connection', (socket: Socket) => {
      logger.info(`Socket connected: ${socket.id}`, {
        userId: socket.data.userId,
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`, {
          userId: socket.data.userId,
        });
      });
    });
  }
}
