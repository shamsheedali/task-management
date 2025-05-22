import { inject, injectable } from 'inversify';
import TYPES from '../../types/inversify.types';
import { ITeamTask } from '../models/teamTask.model';
import { AppError } from '../../utils/appError';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import logger from '../../utils/logger';
import BaseService from '../../common/services/base.service';
import { ITeamTaskService } from '../interfaces/teamTask-service.interface';
import { ITeamTaskRepository } from '../interfaces/teamTask-repository.interface';
import { ITeamRepository } from '../interfaces/team-repository.interface';

@injectable()
export default class TeamTaskService
  extends BaseService<ITeamTask>
  implements ITeamTaskService
{
  private _teamTaskRepository: ITeamTaskRepository;
  private _teamRepository: ITeamRepository;

  constructor(
    @inject(TYPES.TeamTaskRepository) teamTaskRepository: ITeamTaskRepository,
    @inject(TYPES.TeamRepository) teamRepository: ITeamRepository
  ) {
    super(teamTaskRepository);
    this._teamTaskRepository = teamTaskRepository;
    this._teamRepository = teamRepository;
  }

  async createTeamTask(
    title: string,
    teamId: string,
    creatorId: string,
    description?: string,
    status?: 'todo' | 'done',
    isStarred?: boolean,
    dueDate?: Date,
    assigneeId?: string
  ): Promise<ITeamTask> {
    const team = await this._teamRepository.findById(teamId);
    if (!team) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!team.members.includes(creatorId)) {
      throw new AppError(
        'User is not a member of this team',
        HttpStatus.FORBIDDEN
      );
    }

    if (assigneeId && !team.members.includes(assigneeId)) {
      throw new AppError(
        'Assignee must be a team member',
        HttpStatus.BAD_REQUEST
      );
    }

    const existingTask = await this._teamTaskRepository.findOne({
      title,
      teamId,
    });
    if (existingTask) {
      throw new AppError(
        `Task with title '${title}' already exists in this team`,
        HttpStatus.BAD_REQUEST
      );
    }

    const task = await super.create({
      title,
      description,
      status: status || 'todo',
      isStarred: isStarred || false,
      dueDate,
      teamId,
      assigneeId,
      creatorId,
      userId: creatorId,
    });

    logger.info(`Team task created: ${task._id} in team: ${teamId}`);
    return task;
  }

  async getTeamTasks(teamId: string, userId: string): Promise<ITeamTask[]> {
    const team = await this._teamRepository.findById(teamId);
    if (!team) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!team.members.includes(userId)) {
      throw new AppError(
        'User is not a member of this team',
        HttpStatus.FORBIDDEN
      );
    }

    const tasks = await this._teamTaskRepository.find({ teamId });
    logger.info(`Retrieved ${tasks.length} tasks for team: ${teamId}`);
    return tasks;
  }

  async updateTeamTask(
    taskId: string,
    teamId: string,
    userId: string,
    title?: string,
    description?: string,
    status?: 'todo' | 'done',
    isStarred?: boolean,
    dueDate?: Date,
    assigneeId?: string
  ): Promise<ITeamTask> {
    const task = await super.findById(taskId);
    if (!task) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (task.teamId.toString() !== teamId) {
      throw new AppError(
        'Task does not belong to this team',
        HttpStatus.BAD_REQUEST
      );
    }

    const team = await this._teamRepository.findById(teamId);
    if (!team || !team.members.includes(userId)) {
      throw new AppError(
        'User is not a member of this team',
        HttpStatus.FORBIDDEN
      );
    }

    if (assigneeId && !team.members.includes(assigneeId)) {
      throw new AppError(
        'Assignee must be a team member',
        HttpStatus.BAD_REQUEST
      );
    }

    if (title && title !== task.title) {
      const existingTask = await this._teamTaskRepository.findOne({
        title,
        teamId,
        _id: { $ne: taskId },
      });
      if (existingTask) {
        throw new AppError(
          `Task with title '${title}' already exists in this team`,
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const updateData: Partial<ITeamTask> = {
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
      isStarred: isStarred !== undefined ? isStarred : task.isStarred,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      assigneeId: assigneeId !== undefined ? assigneeId : task.assigneeId,
    };

    const updatedTask = await super.update(taskId, updateData);
    if (!updatedTask) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    logger.info(`Team task updated: ${taskId} in team: ${teamId}`);
    return updatedTask;
  }

  async deleteTeamTask(
    taskId: string,
    teamId: string,
    userId: string
  ): Promise<string> {
    const task = await super.findById(taskId);
    if (!task) {
      throw new AppError(ResponseMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (task.teamId.toString() !== teamId) {
      throw new AppError(
        'Task does not belong to this team',
        HttpStatus.BAD_REQUEST
      );
    }

    const team = await this._teamRepository.findById(teamId);
    if (!team || !team.members.includes(userId)) {
      throw new AppError(
        'User is not a member of this team',
        HttpStatus.FORBIDDEN
      );
    }

    await super.delete(taskId);
    logger.info(`Team task deleted: ${taskId} in team: ${teamId}`);
    return task.title;
  }
}
