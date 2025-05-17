import { ITask } from '../models/task.model';

export interface ITaskService {
  createTask(
    title: string,
    taskListId: string,
    userId: string,
    description?: string,
    status?: 'todo' | 'in-progress' | 'done',
    priority?: 'low' | 'medium' | 'high',
    dueDate?: Date,
    parentTaskId?: string
  ): Promise<ITask>;
  updateTask(
    taskId: string,
    userId: string,
    title?: string,
    description?: string,
    status?: 'todo' | 'in-progress' | 'done',
    priority?: 'low' | 'medium' | 'high',
    dueDate?: Date,
    parentTaskId?: string
  ): Promise<ITask>;
  deleteTask(taskId: string, userId: string): Promise<void>;
  getTasksByTaskListId(taskListId: string, userId: string): Promise<ITask[]>;
}
