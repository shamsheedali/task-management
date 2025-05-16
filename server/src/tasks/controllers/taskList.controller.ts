import { inject, injectable } from 'inversify';
import { Response } from 'express';
import TYPES from '../../types/inversify.types';
import { AuthRequest } from '../../middleware/auth.middleware';
import ResponseMessages from '../../common/constants/response';
import { AppError } from '../../utils/appError';
import HttpStatus from '../../common/constants/httpStatus';
import TaskListService from '../services/taskList.service';

@injectable()
export default class TaskListController {
  private _taskListService: TaskListService;

  constructor(@inject(TYPES.TaskListService) taskListService: TaskListService) {
    this._taskListService = taskListService;
  }

  /**
   * Creates a new task list for the authenticated user.
   * @param req - Request with title and authenticated user ID.
   * @param res - Response with created task list data.
   */
  async createTaskList(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const { title } = req.body;
    const taskList = await this._taskListService.createTaskList(title, userId);
    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'Task list created successfully',
      data: {
        id: taskList._id,
        title: taskList.title,
        userId: taskList.userId,
      },
    });
  }

  /**
   * Updates an existing task list's title.
   * @param req - Request with task list ID, new title, and authenticated user ID.
   * @param res - Response with updated task list data.
   */
  async editTaskList(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const taskListId = req.params.id;
    const { title } = req.body;
    const taskList = await this._taskListService.updateTaskList(
      taskListId,
      title,
      userId
    );
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Task list updated successfully',
      data: {
        id: taskList._id,
        title: taskList.title,
        userId: taskList.userId,
      },
    });
  }

  async deleteTaskList(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const taskListId = req.params.id;
    await this._taskListService.deleteTaskList(taskListId, userId);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Task list deleted successfully',
    });
  }
}
