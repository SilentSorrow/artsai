import * as typeorm from 'typeorm';
import { Subject, Type } from '../db/entities';

export default class CatalogService {
  private subjectRepo: typeorm.Repository<Subject>;
  private typeRepo: typeorm.Repository<Type>;

  constructor(private pgConn: typeorm.Connection) {
    this.subjectRepo = this.pgConn.getRepository(Subject);
    this.typeRepo = this.pgConn.getRepository(Type);
  }

  async getSubjects(filterIds: string[] = []): Promise<Subject[]> {
    if (filterIds) {
      return await this.subjectRepo.find({
        where: { id: typeorm.In(filterIds) },
      });
    }

    return await this.subjectRepo.find();
  }

  async getTypes(): Promise<Type[]> {
    return await this.typeRepo.find();
  }
}
