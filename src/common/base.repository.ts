import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';

export interface IBaseRepository<T extends ObjectLiteral> {
  create(data: DeepPartial<T>): Promise<T>;
  findOne(where: FindOptionsWhere<T>): Promise<T>;
  findAll(where?: FindOptionsWhere<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

export class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  constructor(private readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    return await this.repository.findOne({ where });
  }

  async findAll(where?: FindOptionsWhere<T>): Promise<T[]> {
    return await this.repository.find({ where });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return await this.findOne({ id: id } as unknown as FindOptionsWhere<T>);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
