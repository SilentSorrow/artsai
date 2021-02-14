import * as typeorm from 'typeorm';
import { ValidationError } from '../errors';
import { CatalogService } from '../services';
import { Art, Tag, Type, User } from '../db/entities';
import { ArtData } from '../types';

export default class ArtService {
  private artRepo: typeorm.Repository<Art>;
  private tagRepo: typeorm.Repository<Tag>;
  private typeRepo: typeorm.Repository<Type>;
  private userRepo: typeorm.Repository<User>;

  constructor(private pgConn: typeorm.Connection, private catalogService: CatalogService) {
    this.artRepo = this.pgConn.getRepository(Art);
    this.tagRepo = this.pgConn.getRepository(Tag);
    this.typeRepo = this.pgConn.getRepository(Type);
    this.userRepo = this.pgConn.getRepository(User);
  }

  async save(artData: ArtData, user: User): Promise<Art> {
    if (artData.tags.length > 5) {
      throw new ValidationError('Maximum tags - 5');
    }
    if (!artData.subjectIds.length || artData.subjectIds.length > 3) {
      throw new ValidationError('You have to choose between 1 and 3 subjects');
    }

    let saved = undefined;
    try {
      const type = await this.typeRepo.findOne({ id: artData.typeId });
      const art = {
        title: artData.title,
        description: artData.description,
        mainImage: artData.mainImage,
        user,
        type,
      } as Art;

      const subjects = await this.catalogService.getSubjects(artData.subjectIds);
      art.subjects = subjects;

      saved = await this.artRepo.save(art);

      if (artData.tags.length) {
        for (const artTag of artData.tags) {
          const tag = {
            value: artTag,
            art: saved,
          };
          await this.tagRepo.save(tag);
        }
      }

      return saved;
    } catch (err) {
      throw new ValidationError('Invalid art data', err.message);
    }
  }
}
