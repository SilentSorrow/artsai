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
    return await this.subjectRepo.find(
      filterIds.length && {
        where: { id: typeorm.In(filterIds) },
      }
    );
  }

  async getTypes(): Promise<Type[]> {
    return await this.typeRepo.find();
  }
}
