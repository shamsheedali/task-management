import { FilterQuery, UpdateQuery } from 'mongoose';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';
import { ITeamTask } from '../models/teamTask.model';

export interface ITeamTaskRepository extends IBaseRepository<ITeamTask> {
  findOne(query: FilterQuery<ITeamTask>): Promise<ITeamTask | null>;
  find(query: FilterQuery<ITeamTask>): Promise<ITeamTask[]>;
  update(id: string, data: UpdateQuery<ITeamTask>): Promise<ITeamTask | null>;
}
