import { inject, injectable } from 'inversify';
import { FilterQuery, Model } from 'mongoose';
import TYPES from '../../types/inversify.types';
import { INotificationRepository } from '../interfaces/notification-repository.interface';
import { INotification } from '../models/notification.model';
import BaseRepository from '../../common/repositories/base.repository';

@injectable()
export default class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor(
    @inject(TYPES.NotificationModel) notificationModel: Model<INotification>
  ) {
    super(notificationModel);
  }

  async find(query: FilterQuery<INotification>): Promise<INotification[]> {
    return await this.model.find(query).exec();
  }
}
