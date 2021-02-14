import * as typeorm from 'typeorm';
import fs from 'fs';
import { ART_IMG_DIRECTORY } from '../app/constants';
import { ValidationError } from '../errors';
import { CatalogService } from '../services';
import { Art, Tag, Type, User } from '../db/entities';
import { ArtData } from '../types';
import { omitUser, isAuthorized } from '../utils';

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

  async changeMainImage(mainImage: string, user: User, id: string): Promise<any> {
    await isAuthorized<Art>(Art, id, user);

    const oldArt = await this.artRepo.findOne({ id }, { relations: ['user'] });
    if (!oldArt) {
      return undefined;
    }
    fs.unlinkSync(`${process.cwd()}/${ART_IMG_DIRECTORY}/${oldArt?.mainImage}`);
    await this.artRepo.update({ id }, { mainImage });

    oldArt.mainImage = mainImage;
    oldArt.user = omitUser(oldArt.user as User);

    return oldArt;
  }

  async getById(artId: string): Promise<Art> {
    const art = await this.artRepo.findOne({ id: artId }, { relations: ['type', 'subjects', 'tags', 'user'] });

    if (art?.user) {
      art.user = omitUser(art?.user as User);
    }

    return art as Art;
  }
}
