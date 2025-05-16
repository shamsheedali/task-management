import { inject, injectable } from 'inversify';
import TYPES from '../../types/inversify.types';
import { Model } from 'mongoose';
import { ITaskListRepository } from '../interfaces/taskList-repository.interface';
import { ITaskList } from '../models/taskList.model';
import BaseRepository from '../../common/repositories/base.repository';

@injectable()
export default class TaskListRepository
  extends BaseRepository<ITaskList>
  implements ITaskListRepository
{
  constructor(@inject(TYPES.TaskListModel) taskListModel: Model<ITaskList>) {
    super(taskListModel);
  }
}
