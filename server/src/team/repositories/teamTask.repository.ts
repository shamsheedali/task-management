import { inject, injectable } from 'inversify';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import TYPES from '../../types/inversify.types';
import { ITeamTaskRepository } from '../interfaces/teamTask-repository.interface';
import { ITeamTask } from '../models/teamTask.model';
import BaseRepository from '../../common/repositories/base.repository';

@injectable()
export default class TeamTaskRepository
  extends BaseRepository<ITeamTask>
  implements ITeamTaskRepository
{
  constructor(@inject(TYPES.TeamTaskModel) teamTaskModel: Model<ITeamTask>) {
    super(teamTaskModel);
  }

  async findOne(query: FilterQuery<ITeamTask>): Promise<ITeamTask | null> {
    return await this.model.findOne(query).exec();
  }

  async find(query: FilterQuery<ITeamTask>): Promise<ITeamTask[]> {
    return await this.model.find(query).exec();
  }

  async update(
    id: string,
    data: UpdateQuery<ITeamTask>
  ): Promise<ITeamTask | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
