import { inject, injectable } from 'inversify';
import TYPES from '../../types/inversify.types';
import { ITaskList } from '../models/taskList.model';
import { AppError } from '../../utils/appError';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import { ITaskListRepository } from '../interfaces/taskList-repository.interface';
import { IUserRepository } from '../../users/interfaces/user-repository.interface';
import logger from '../../utils/logger';
import BaseService from '../../common/services/base.service';
import { ITaskListService } from '../interfaces/taskList-service.interface';

@injectable()
export default class TaskListService
  extends BaseService<ITaskList>
  implements ITaskListService
{
  private _taskListRepository: ITaskListRepository;
  private _userRepository: IUserRepository;

  constructor(
    @inject(TYPES.TaskListRepository) taskListRepository: ITaskListRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository
  ) {
    super(taskListRepository);
    this._taskListRepository = taskListRepository;
    this._userRepository = userRepository;
  }

  async createTaskList(title: string, userId: string): Promise<ITaskList> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const taskList = await super.create({ title, userId });
    await this._userRepository.update(userId, {
      $push: { taskLists: taskList._id },
    });

    logger.info(`Task list created: ${taskList._id} for user: ${userId}`);
    return taskList;
  }

  async updateTaskList(
    id: string,
    title: string,
    userId: string
  ): Promise<ITaskList> {
    const taskList = await super.findById(id);
    if (!taskList) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (taskList.userId.toString() !== userId) {
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }

    const updatedTaskList = await super.update(id, { title });
    if (!updatedTaskList) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info(`Task list updated: ${id} for user: ${userId}`);
    return updatedTaskList;
  }
}
