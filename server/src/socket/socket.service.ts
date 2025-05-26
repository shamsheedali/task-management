import { Server, Socket } from 'socket.io';
import { injectable, inject } from 'inversify';
import TYPES from '../types/inversify.types';
import type { ITokenService } from '../common/interfaces/token-service.interface';
import logger from '../utils/logger';
import { env } from '../config/env';
import { ITeamService } from '../team/interfaces/team-service.interface';

@injectable()
export class SocketService {
  private io: Server | null = null;

  constructor(
    @inject(TYPES.TokenService) private tokenService: ITokenService,
    @inject(TYPES.TeamService) private teamService: ITeamService
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
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e6,
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
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

  private async setupConnection(): Promise<void> {
    if (!this.io) {
      throw new Error('Socket.IO server not initialized');
    }

    this.io.on('connection', async (socket: Socket) => {
      const userId = socket.data.userId as string;
      logger.info(`Socket connected: ${socket.id}`, { userId });

      try {
        const teams = await this.teamService.getUserTeams(userId);
        for (const team of teams) {
          socket.join(`team:${team.id}`);
          logger.info(`Socket ${socket.id} joined team:${team.id}`, { userId });
        }
      } catch (error) {
        logger.error('Failed to join team rooms:', {
          userId,
          error: (error as Error).message,
        });
      }

      socket.on(
        'TEAM_USER_JOINED',
        async ({ inviteCode, userId, username }) => {
          if (!inviteCode || !userId || !username) {
            logger.warn('TEAM_USER_JOINED missing data', {
              inviteCode,
              userId,
              username,
            });
            return;
          }

          try {
            const team = await this.teamService.getTeamByCode(
              userId,
              inviteCode
            );
            socket.join(`team:${team.id}`); // join the new room if needed

            this.io?.to(`team:${team.id}`).emit('TEAM_USER_JOINED', {
              teamId: team.id,
              userId,
              username,
            });

            logger.info('Emitted TEAM_USER_JOINED', {
              teamId: team.id,
              userId,
              username,
            });
          } catch (error) {
            logger.error('Failed to emit TEAM_USER_JOINED:', {
              error: (error as Error).message,
              inviteCode,
              userId,
            });
          }
        }
      );

      socket.on('task:create', ({ teamId, createdBy }) => {
        if (!teamId || !createdBy) {
          logger.warn('Missing data in task:create', { teamId, createdBy });
          return;
        }

        logger.info('Received task:create', { teamId, createdBy });

        socket.to(`team:${teamId}`).emit('TASK_CREATED_NOTIFICATION', {
          teamId,
          createdBy,
          message: `A new task was created ${createdBy}`,
        });

        logger.info('Emitted TASK_CREATED_NOTIFICATION', { teamId });
      });

      socket.on('task:edit', ({ teamId, editedBy }) => {
        if (!teamId || !editedBy) {
          logger.warn('Missing data in task:create', { teamId, editedBy });
          return;
        }

        logger.info('Received task:create', { teamId, editedBy });

        socket.to(`team:${teamId}`).emit('TASK_EDIT_NOTIFICATION', {
          teamId,
          editedBy,
          message: `A task was edited by ${editedBy}`,
        });

        logger.info('Emitted TASK_EDIT_NOTIFICATION', { teamId });
      });

      socket.on('task:delete', ({ teamId, deletedBy }) => {
        if (!teamId || !deletedBy) {
          logger.warn('Missing data in task:delete', { teamId, deletedBy });
          return;
        }

        socket.to(`team:${teamId}`).emit('TASK_DELETE_NOTIFICATION', {
          teamId,
          deletedBy,
          message: `A task was deleted by ${deletedBy}`,
        });

        logger.info('Emitted TASK_EDIT_NOTIFICATION', { teamId });
      });

      socket.on(
        'task:complete',
        ({ teamId, completedBy, taskTitle, newStatus }) => {
          if (!teamId || !completedBy || !taskTitle || !newStatus) {
            logger.warn('Missing data in task:complete', {
              teamId,
              completedBy,
              taskTitle,
              newStatus,
            });
            return;
          }

          logger.info('Received task:complete', {
            teamId,
            completedBy,
            taskTitle,
            newStatus,
          });

          socket.to(`team:${teamId}`).emit('TASK_COMPLETED_NOTIFICATION', {
            teamId,
            completedBy,
            taskTitle,
            newStatus,
            message: `${completedBy} marked task "${taskTitle}" as ${newStatus}`,
          });

          logger.info('Emitted TASK_COMPLETED_NOTIFICATION', { teamId });
        }
      );

      socket.on(
        'team:leave',
        (teamId: string, teamName: string, user: string) => {
          socket.to(`team:${teamId}`).emit('USER_LEAVE_TEAM', {
            teamId,
            user,
            message: `${user} leaved from ${teamName}`,
          });
        }
      );

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`, { userId });
      });
    });
  }
}
