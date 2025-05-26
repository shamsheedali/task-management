import { inject, injectable } from 'inversify';
import { Response } from 'express';
import TYPES from '../../types/inversify.types';
import { AuthRequest } from '../../middleware/auth.middleware';
import ResponseMessages from '../../common/constants/response';
import HttpStatus from '../../common/constants/httpStatus';
import { AppError } from '../../utils/appError';
import {
  CreateTeamTaskInput,
  UpdateTeamTaskInput,
} from '../validators/teamTask.validator';
import TeamTaskService from '../services/teamTask.service';
import NotificationService from '../services/notification.service';
import { TeamTaskDTO, toTeamTaskDTO } from '../dto/teamTask.dto';

@injectable()
export default class TeamTaskController {
  private _teamTaskService: TeamTaskService;
  private _notificationService: NotificationService;

  constructor(
    @inject(TYPES.TeamTaskService) teamTaskService: TeamTaskService,
    @inject(TYPES.NotificationService) notificationService: NotificationService
  ) {
    this._teamTaskService = teamTaskService;
    this._notificationService = notificationService;
  }

  async createTeamTask(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );

    const teamId = req.params.teamId;
    const {
      title,
      description,
      status,
      isStarred,
      dueDate,
      assigneeId,
    }: CreateTeamTaskInput = req.body;
    const task = await this._teamTaskService.createTeamTask(
      title,
      teamId,
      userId,
      description,
      status,
      isStarred,
      dueDate ? new Date(dueDate) : undefined,
      assigneeId
    );
    await this._notificationService.createNotification(
      teamId,
      `User ${req.user?.email} created task: ${title}`
    );
    const taskDTO: TeamTaskDTO = toTeamTaskDTO(task);

    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'Team task created successfully',
      data: taskDTO,
    });
  }

  async getTeamTasks(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );

    const teamId = req.params.teamId;
    const tasks = await this._teamTaskService.getTeamTasks(teamId, userId);
    const taskDTOs: TeamTaskDTO[] = tasks.map(task => toTeamTaskDTO(task));
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Team tasks retrieved successfully',
      data: taskDTOs,
    });
  }

  async updateTeamTask(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );

    const teamId = req.params.teamId;
    const taskId = req.params.taskId;
    const {
      title,
      description,
      status,
      isStarred,
      dueDate,
      assigneeId,
    }: UpdateTeamTaskInput = req.body;
    const task = await this._teamTaskService.updateTeamTask(
      taskId,
      teamId,
      userId,
      title,
      description,
      status,
      isStarred,
      dueDate ? new Date(dueDate) : undefined,
      assigneeId
    );
    await this._notificationService.createNotification(
      teamId,
      `User ${req.user?.email} updated task: ${task.title}`
    );
    const taskDTO: TeamTaskDTO = toTeamTaskDTO(task);

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Team task updated successfully',
      data: taskDTO,
    });
  }

  async deleteTeamTask(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId)
      throw new AppError(
        ResponseMessages.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );

    const teamId = req.params.teamId;
    const taskId = req.params.taskId;
    const taskTitle = await this._teamTaskService.deleteTeamTask(
      taskId,
      teamId,
      userId
    );
    await this._notificationService.createNotification(
      teamId,
      `User ${req.user?.email} deleted task: ${taskTitle}`
    );

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Team task deleted successfully',
    });
  }
}
