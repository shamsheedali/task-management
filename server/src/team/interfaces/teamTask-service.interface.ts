import { ITeamTask } from '../models/teamTask.model';

export interface ITeamTaskService {
  createTeamTask(
    title: string,
    teamId: string,
    creatorId: string,
    description?: string,
    status?: 'todo' | 'done',
    isStarred?: boolean,
    dueDate?: Date,
    assigneeId?: string
  ): Promise<ITeamTask>;
  getTeamTasks(teamId: string, userId: string): Promise<ITeamTask[]>;
  updateTeamTask(
    taskId: string,
    teamId: string,
    userId: string,
    title?: string,
    description?: string,
    status?: 'todo' | 'done',
    isStarred?: boolean,
    dueDate?: Date,
    assigneeId?: string
  ): Promise<ITeamTask>;
  deleteTeamTask(
    taskId: string,
    teamId: string,
    userId: string
  ): Promise<string>;
}
