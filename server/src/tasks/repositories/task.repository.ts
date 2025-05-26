import { inject, injectable } from 'inversify';
import { FilterQuery, Model } from 'mongoose';
import TYPES from '../../types/inversify.types';
import { ITaskRepository } from '../interfaces/task-repository.interface';
import { ITask } from '../models/task.model';
import BaseRepository from '../../common/repositories/base.repository';

@injectable()
export default class TaskRepository
  extends BaseRepository<ITask>
  implements ITaskRepository
{
  constructor(@inject(TYPES.TaskModel) taskModel: Model<ITask>) {
    super(taskModel);
  }

  async findOne(query: FilterQuery<ITask>): Promise<ITask | null> {
    return await this.model.findOne(query).exec();
  }

  async findByTaskListId(taskListId: string, userId: string): Promise<ITask[]> {
    return await this.model.find({ taskListId, userId }).exec();
  }

  async find(query: FilterQuery<ITask>): Promise<ITask[]> {
    return await this.model.find(query).exec();
  }

  async deleteMany(query: FilterQuery<ITask>): Promise<void> {
    await this.model.deleteMany(query).exec();
  }
}
