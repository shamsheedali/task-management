import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import { AppError } from '../../utils/appError';
import { CreateNotificationInput } from '../validators/notification.validator';
import TYPES from '../../types/inversify.types';
import NotificationService from '../services/notification.service';

@injectable()
export default class NotificationController {
  private _notificationService: NotificationService;

  constructor(
    @inject(TYPES.NotificationService) notificationService: NotificationService
  ) {
    this._notificationService = notificationService;
  }

  /**
   * Retrieves all notifications for a team.
   * @param req - Request with team ID and authenticated user ID.
   * @param res - Response with team notifications.
   */
  async getNotifications(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const teamId = req.params.teamId;
    const notifications = await this._notificationService.getNotifications(
      teamId,
      userId
    );
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Notifications retrieved successfully',
      data: notifications.map(notification => ({
        id: notification._id,
        message: notification.message,
        teamId: notification.teamId,
        timestamp: notification.timestamp,
        createdAt: notification.createdAt,
      })),
    });
  }

  /**
   * Creates a notification for a team.
   * @param req - Request with team ID, message, and authenticated user ID.
   * @param res - Response with created notification data.
   */
  async createNotification(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const teamId = req.params.teamId;
    const { message }: CreateNotificationInput = req.body;
    const notification = await this._notificationService.createNotification(
      teamId,
      message
    );

    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'Notification created successfully',
      data: {
        id: notification._id,
        message: notification.message,
        teamId: notification.teamId,
        timestamp: notification.timestamp,
        createdAt: notification.createdAt,
      },
    });
  }
}
