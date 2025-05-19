import { inject, injectable } from 'inversify';
import { Response } from 'express';
import TYPES from '../../types/inversify.types';
import { AuthRequest } from '../../middleware/auth.middleware';
import ResponseMessages from '../../common/constants/response';
import { AppError } from '../../utils/appError';
import HttpStatus from '../../common/constants/httpStatus';
import { ITaskService } from '../interfaces/task-service.interface';

@injectable()
export default class TaskController {
  private _taskService: ITaskService;

  constructor(@inject(TYPES.TaskService) taskService: ITaskService) {
    this._taskService = taskService;
  }

  async createTask(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const taskListId = req.params.taskListId;
    const { title, description, status, isStarred, dueDate, parentTaskId } =
      req.body;
    const task = await this._taskService.createTask(
      title,
      taskListId,
      userId,
      description,
      status,
      isStarred,
      dueDate ? new Date(dueDate) : undefined,
      parentTaskId
    );

    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'Task created successfully',
      data: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        isStarred: task.isStarred,
        dueDate: task.dueDate,
        taskListId: task.taskListId,
        userId: task.userId,
        parentTaskId: task.parentTaskId,
        createdAt: task.createdAt,
      },
    });
  }

  async updateTask(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const taskId = req.params.taskId;
    const { title, description, status, isStarred, dueDate, parentTaskId } =
      req.body;
    const task = await this._taskService.updateTask(
      taskId,
      userId,
      title,
      description,
      status,
      isStarred,
      dueDate ? new Date(dueDate) : undefined,
      parentTaskId
    );

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Task updated successfully',
      data: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        isStarred: task.isStarred,
        dueDate: task.dueDate,
        taskListId: task.taskListId,
        userId: task.userId,
        parentTaskId: task.parentTaskId,
        updatedAt: task.updatedAt,
      },
    });
  }

  async deleteTask(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const taskId = req.params.taskId;
    await this._taskService.deleteTask(taskId, userId);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  }

  async getTasksByTaskListId(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const taskListId = req.params.taskListId;
    const tasks = await this._taskService.getTasksByTaskListId(
      taskListId,
      userId
    );
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Tasks retrieved successfully',
      data: tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        isStarred: task.isStarred,
        dueDate: task.dueDate,
        taskListId: task.taskListId,
        userId: task.userId,
        parentTaskId: task.parentTaskId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    });
  }
}
