import * as typeorm from 'typeorm';
import fs from 'fs';
import { IMG_DIRECTORY_PATH } from '../app/constants';
import { BadRequestError } from 'routing-controllers';
import { User, Like } from '../db/entities';

export default class MediaService {
  private likeRepo: typeorm.Repository<Like>;

  constructor(private pgConn: typeorm.Connection) {
    this.likeRepo = this.pgConn.getRepository(Like);
  }

  getImage(imageFileName: string): Buffer | undefined {
    try {
      const buffer = fs.readFileSync(`${IMG_DIRECTORY_PATH}/${imageFileName}`);

      return buffer;
    } catch (err) {
      return undefined;
    }
  }

  async getLikesByArtId(artId: string): Promise<Like[]> {
    const likes = await this.pgConn.query(
      `SELECT id, art_id as "artId", user_id as "userId", created_at as "createdAt" FROM "like" WHERE art_id = $1`,
      [artId]
    );

    return likes;
  }

  async toggleLike(artId: string, user: User): Promise<void> {
    try {
      const like = await this.likeRepo.findOne({
        where: {
          art: {
            id: artId,
          },
          user: {
            id: user.id,
          },
        },
        relations: ['art', 'user'],
      });

      if (like) {
        await this.likeRepo.remove(like);
      } else {
        await this.pgConn.query(`INSERT INTO "like"(art_id, user_id) VALUES($1, $2)`, [artId, user.id]);
      }
    } catch (err) {
      throw new BadRequestError('Something went wrong...');
    }
  }
}
