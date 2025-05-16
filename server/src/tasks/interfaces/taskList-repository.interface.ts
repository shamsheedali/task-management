import { IBaseRepository } from '../../common/interfaces/base-repository.interface';
import { ITaskList } from '../models/taskList.model';

export interface ITaskListRepository extends IBaseRepository<ITaskList> {
  create(taskList: { title: string; userId: string }): Promise<ITaskList>;
  findById(id: string): Promise<ITaskList | null>;
  update(id: string, data: Partial<ITaskList>): Promise<ITaskList | null>;
}
