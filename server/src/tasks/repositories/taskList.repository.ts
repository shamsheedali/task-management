import { inject, injectable } from 'inversify';
import { FilterQuery, Model } from 'mongoose';
import TYPES from '../../types/inversify.types';
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

  async findOne(query: FilterQuery<ITaskList>): Promise<ITaskList | null> {
    return await this.model.findOne(query).exec();
  }

  async find(query: FilterQuery<ITaskList>): Promise<ITaskList[]> {
    return await this.model.find(query).exec();
  }
}
