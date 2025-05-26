import { INotification } from '../models/notification.model';

export interface INotificationService {
  getNotifications(teamId: string, userId: string): Promise<INotification[]>;
  createNotification(teamId: string, message: string): Promise<INotification>;
}
