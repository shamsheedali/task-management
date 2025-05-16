import { ITaskList } from '../models/taskList.model';

export interface ITaskListService {
  createTaskList(title: string, userId: string): Promise<ITaskList>;
  updateTaskList(id: string, title: string, userId: string): Promise<ITaskList>;
}
