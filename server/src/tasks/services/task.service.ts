import { inject, injectable } from 'inversify';
import TYPES from '../../types/inversify.types';
import { ITask } from '../models/task.model';
import { AppError } from '../../utils/appError';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import { ITaskRepository } from '../interfaces/task-repository.interface';
import { ITaskListRepository } from '../interfaces/taskList-repository.interface';
import logger from '../../utils/logger';
import BaseService from '../../common/services/base.service';
import { ITaskService } from '../interfaces/task-service.interface';

@injectable()
export default class TaskService
  extends BaseService<ITask>
  implements ITaskService
{
  private _taskRepository: ITaskRepository;
  private _taskListRepository: ITaskListRepository;

  constructor(
    @inject(TYPES.TaskRepository) taskRepository: ITaskRepository,
    @inject(TYPES.TaskListRepository) taskListRepository: ITaskListRepository
  ) {
    super(taskRepository);
    this._taskRepository = taskRepository;
    this._taskListRepository = taskListRepository;
  }

  async createTask(
    title: string,
    taskListId: string,
    userId: string,
    description?: string,
    status?: 'todo' | 'done',
    isStarred?: boolean,
    dueDate?: Date,
    parentTaskId?: string
  ): Promise<ITask> {
    // Verify task list exists and belongs to user
    const taskList = await this._taskListRepository.findOne({
      _id: taskListId,
      userId,
    });
    if (!taskList) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Verify parent task exists and belongs to the same task list
    if (parentTaskId) {
      const parentTask = await this._taskRepository.findOne({
        _id: parentTaskId,
        taskListId,
        userId,
      });
      if (!parentTask) {
        throw new AppError(
          'Parent task not found or invalid',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // Check for duplicate title in task list
    const existingTask = await this._taskRepository.findOne({
      title,
      taskListId,
      userId,
    });
    if (existingTask) {
      throw new AppError(
        `Task with title '${title}' already exists in this task list`,
        HttpStatus.BAD_REQUEST
      );
    }

    const task = await super.create({
      title,
      description,
      status: status || 'todo',
      isStarred: isStarred || false,
      dueDate,
      taskListId,
      userId,
      parentTaskId,
    });

    logger.info(`Task created: ${task._id} in task list: ${taskListId}`);
    return task;
  }

  async updateTask(
    taskId: string,
    userId: string,
    title?: string,
    description?: string,
    status?: 'todo' | 'done',
    isStarred?: boolean,
    dueDate?: Date,
    parentTaskId?: string
  ): Promise<ITask> {
    const task = await super.findById(taskId);
    if (!task) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (task.userId.toString() !== userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    // Verify parent task exists and belongs to the same task list
    if (parentTaskId) {
      const parentTask = await this._taskRepository.findOne({
        _id: parentTaskId,
        taskListId: task.taskListId,
        userId,
      });
      if (!parentTask) {
        throw new AppError(
          'Parent task not found or invalid',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // Check for duplicate title if updated
    if (title && title !== task.title) {
      const existingTask = await this._taskRepository.findOne({
        title,
        taskListId: task.taskListId,
        userId,
        _id: { $ne: taskId },
      });
      if (existingTask) {
        throw new AppError(
          `Task with title '${title}' already exists in this task list`,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const updateData: Partial<ITask> = {
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
      isStarred: isStarred !== undefined ? isStarred : task.isStarred,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      parentTaskId:
        parentTaskId !== undefined ? parentTaskId : task.parentTaskId,
    };

    const updatedTask = await super.update(taskId, updateData);
    if (!updatedTask) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info(`Task updated: ${taskId} for user: ${userId}`);
    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await super.findById(taskId);
    if (!task) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (task.userId.toString() !== userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    // Check for sub-tasks
    const subTasks = await this._taskRepository.findOne({
      parentTaskId: taskId,
      userId,
    });
    if (subTasks) {
      throw new AppError(
        'Cannot delete task with sub-tasks',
        HttpStatus.BAD_REQUEST
      );
    }

    await super.delete(taskId);
    logger.info(`Task deleted: ${taskId} for user: ${userId}`);
  }

  async getTasksByTaskListId(
    taskListId: string,
    userId: string
  ): Promise<ITask[]> {
    const taskList = await this._taskListRepository.findOne({
      _id: taskListId,
      userId,
    });
    if (!taskList) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const tasks = await this._taskRepository.findByTaskListId(
      taskListId,
      userId
    );
    return tasks;
  }

  async getTaskSummary(
    userId: string
  ): Promise<{ done: number; todo: number }> {
    const tasks = await this._taskRepository.find({ userId });
    const summary = tasks.reduce(
      (acc, task) => {
        if (task.status === 'done') acc.done += 1;
        if (task.status === 'todo') acc.todo += 1;
        return acc;
      },
      { done: 0, todo: 0 }
    );
    return summary;
  }

  async getTaskStats(
    userId: string,
    days: number
  ): Promise<{ date: string; tasks: number }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const tasks = await this._taskRepository.find({
      userId,
      status: 'done',
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    // Group tasks by date
    const statsMap: { [key: string]: number } = {};
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split('T')[0];
      statsMap[dateStr] = 0;
    }

    tasks.forEach(task => {
      const dateStr = task.updatedAt.toISOString().split('T')[0];
      if (statsMap[dateStr] !== undefined) {
        statsMap[dateStr] += 1;
      }
    });

    const stats = Object.entries(statsMap).map(([date, tasks]) => ({
      date,
      tasks,
    }));

    return stats.sort((a, b) => a.date.localeCompare(b.date));
  }
}
