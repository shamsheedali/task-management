import { FilterQuery } from 'mongoose';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';
import { INotification } from '../models/notification.model';

export interface INotificationRepository
  extends IBaseRepository<INotification> {
  find(query: FilterQuery<INotification>): Promise<INotification[]>;
}
