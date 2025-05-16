import { injectable } from 'inversify';
import { Document } from 'mongoose';
import { IBaseRepository } from '../interfaces/base-repository.interface';

@injectable()
export default abstract class BaseService<T extends Document> {
  protected repository: IBaseRepository<T>;

  constructor(repository: IBaseRepository<T>) {
    this.repository = repository;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.repository.findById(id);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.findAll();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<T | null> {
    return await this.repository.delete(id);
  }
}
