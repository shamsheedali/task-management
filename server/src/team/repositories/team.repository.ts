import { inject, injectable } from 'inversify';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import TYPES from '../../types/inversify.types';
import { ITeamRepository } from '../interfaces/team-repository.interface';
import { ITeam } from '../models/team.model';
import BaseRepository from '../../common/repositories/base.repository';

@injectable()
export default class TeamRepository
  extends BaseRepository<ITeam>
  implements ITeamRepository
{
  constructor(@inject(TYPES.TeamModel) teamModel: Model<ITeam>) {
    super(teamModel);
  }

  async findOne(query: FilterQuery<ITeam>): Promise<ITeam | null> {
    return await this.model.findOne(query).exec();
  }

  async find(query: FilterQuery<ITeam>): Promise<ITeam[]> {
    return await this.model.find(query).exec();
  }

  async update(id: string, data: UpdateQuery<ITeam>): Promise<ITeam | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
