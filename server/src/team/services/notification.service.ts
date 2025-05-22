import { inject, injectable } from 'inversify';
import TYPES from '../../types/inversify.types';
import { INotification } from '../models/notification.model';
import { AppError } from '../../utils/appError';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import logger from '../../utils/logger';
import BaseService from '../../common/services/base.service';
import { INotificationService } from '../interfaces/notification-service.interface';
import { INotificationRepository } from '../interfaces/notification-repository.interface';
import { ITeamRepository } from '../interfaces/team-repository.interface';

@injectable()
export default class NotificationService
  extends BaseService<INotification>
  implements INotificationService
{
  private _notificationRepository: INotificationRepository;
  private _teamRepository: ITeamRepository;

  constructor(
    @inject(TYPES.NotificationRepository)
    notificationRepository: INotificationRepository,
    @inject(TYPES.TeamRepository) teamRepository: ITeamRepository
  ) {
    super(notificationRepository);
    this._notificationRepository = notificationRepository;
    this._teamRepository = teamRepository;
  }

  async getNotifications(
    teamId: string,
    userId: string
  ): Promise<INotification[]> {
    const team = await this._teamRepository.findById(teamId);
    if (!team) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!team.members.includes(userId)) {
      throw new AppError(
        'User is not a member of this team',
        HttpStatus.FORBIDDEN
      );
    }

    const notifications = await this._notificationRepository.find({ teamId });
    logger.info(
      `Retrieved ${notifications.length} notifications for team: ${teamId}`
    );
    return notifications;
  }

  async createNotification(
    teamId: string,
    message: string
  ): Promise<INotification> {
    const team = await this._teamRepository.findById(teamId);
    if (!team) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const notification = await super.create({
      message,
      teamId,
      timestamp: new Date(),
    });

    logger.info(`Notification created for team: ${teamId}`);
    return notification;
  }
}
