import { injectable } from 'inversify';
import { Model, Document } from 'mongoose';
import { IBaseRepository } from '../interfaces/base-repository.interface';

@injectable()
export default abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  public model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async findAllPaginated(skip: number, limit: number): Promise<T[]> {
    return await this.model.find().skip(skip).limit(limit);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
