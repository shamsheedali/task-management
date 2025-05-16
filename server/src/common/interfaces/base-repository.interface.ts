import { Document, Model } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  model: Model<T>;
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  findAllPaginated(skip: number, limit: number): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}
