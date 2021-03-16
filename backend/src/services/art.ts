import * as typeorm from 'typeorm';
import { UnauthorizedError } from 'routing-controllers';
import { ValidationError } from '../errors';
import { CatalogService } from '.';
import { TOP_ART_COUNT } from '../app/constants';
import { Art, Tag, Type, User } from '../db/entities';
import { ArtData, OmitedArt } from '../types';
import { omitArt, omitUser } from '../utils';

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

    const { user: u, ...rest } = await this.artRepo.remove(art as Art);

    return rest as Art;
  }

  async getTop(): Promise<OmitedArt[]> {
    return await this.pgConn.query(
      `
      SELECT art.id, main_image as "mainImage", art.created_At as "createdAt", type.value as type FROM art
      INNER JOIN type ON art.type_id = type.id
      WHERE art.id IN (SELECT art_id FROM "like" GROUP BY art_id ORDER BY count(*) DESC LIMIT $1)
      `, // something with date, like created within last week
      [TOP_ART_COUNT]
    );
  }

  async search(q: string, options: string[]): Promise<OmitedArt[]> {
    let optionQuery = '';
    if (options.includes('title')) {
      optionQuery += `WHERE UPPER(title) LIKE '%'||:q||'%'`;
    }
    if (options.includes('description')) {
      optionQuery += optionQuery
        ? ` OR UPPER(description) LIKE '%'||:q||'%'`
        : `WHERE UPPER(description) LIKE '%'||:q||'%'`;
    }
    if (options.includes('tags')) {
      optionQuery += optionQuery ? ` OR UPPER(tag.value) = :q` : `WHERE UPPER(tag.value) = :q`;
    }

    const [query, params] = this.pgConn.driver.escapeQueryWithParameters(
      `
      SELECT DISTINCT art.id, main_image as "mainImage", art.created_At as "createdAt",
      type.id as type, ARRAY_AGG(subject_art_art."subjectId") subjects FROM art
      INNER JOIN tag ON art.id = tag.art_id
      INNER JOIN subject_art_art ON art.id = subject_art_art."artId"
      INNER JOIN type ON art.type_id = type.id
      ${optionQuery}
      GROUP BY art.id, type.id`,
      { q: q.toUpperCase() },
      {}
    );

    return await this.pgConn.query(query, params);
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

  async getLiked(userId: string): Promise<OmitedArt[]> {
    const liked = await this.pgConn.query(
      `
      SELECT art.id, art.main_image as "mainImage", art.created_at as "createdAt" FROM art
      INNER JOIN "like" ON art.id = "like".art_id WHERE "like".user_id = $1
      `,
      [userId]
    );

    return liked;
  }
}
