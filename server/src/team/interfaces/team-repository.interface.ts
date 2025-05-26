import { FilterQuery, UpdateQuery } from 'mongoose';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';
import { ITeam } from '../models/team.model';

export interface ITeamRepository extends IBaseRepository<ITeam> {
  findOne(query: FilterQuery<ITeam>): Promise<ITeam | null>;
  find(query: FilterQuery<ITeam>): Promise<ITeam[]>;
  update(id: string, data: UpdateQuery<ITeam>): Promise<ITeam | null>;
}
