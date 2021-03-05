import * as typeorm from 'typeorm';
import { ValidationError } from '../errors';
import { CatalogService } from '.';
import { TOP_ART_COUNT } from '../app/constants';
import { Art, Tag, Type, User } from '../db/entities';
import { ArtData, OmitedArt } from '../types';
import { omitArt, omitUser } from '../utils';
import { UnauthorizedError } from 'routing-controllers';

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

      saved.user = omitUser(saved.user as User);

      return saved;
    } catch (err) {
      throw new ValidationError('Invalid art data', err.message);
    }
  }

  async delete(id: string, user: User): Promise<Art | undefined> {
    const art = await this.artRepo.findOne(id, { relations: ['user'] });
    if (!art) {
      return art;
    }
    if (art.user.id !== user.id) {
      throw new UnauthorizedError('You are not authorized to make this action');
    }

    return this.artRepo.remove(art as Art);
  }

  async getTop(): Promise<OmitedArt[]> {
    const top = await this.pgConn.query(
      `
      SELECT id, main_image, created_At FROM art WHERE id
      IN (SELECT art_id FROM "like" GROUP BY art_id ORDER BY count(*) DESC LIMIT $1)
      `, // something with date, like created within last week
      [TOP_ART_COUNT]
    );

    return top;
  }

  async getById(artId: string): Promise<Art> {
    const art = await this.artRepo.findOne({ id: artId }, { relations: ['type', 'subjects', 'tags', 'user'] });
    if (art?.user) {
      art.user = omitUser(art?.user as User);
    }

    return art as Art;
  }

  async getAllUserArt(userId: string): Promise<OmitedArt[]> {
    const user = await this.userRepo.findOne({ id: userId });
    const art = await this.artRepo.find({ user });

    return art.map((a) => omitArt(a));
  }
}
