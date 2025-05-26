import { FilterQuery } from 'mongoose';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';
import { ITask } from '../models/task.model';

export interface ITaskRepository extends IBaseRepository<ITask> {
  findOne(query: FilterQuery<ITask>): Promise<ITask | null>;
  findByTaskListId(taskListId: string, userId: string): Promise<ITask[]>;
  find(query: FilterQuery<ITask>): Promise<ITask[]>;
}
