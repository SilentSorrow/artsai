import { BadRequestError } from 'routing-controllers';
import * as typeorm from 'typeorm';
import { User, Like } from '../db/entities';

export default class MediaService {
  private likeRepo: typeorm.Repository<Like>;

  constructor(private pgConn: typeorm.Connection) {
    this.likeRepo = this.pgConn.getRepository(Like);
  }

  async getLikesByArtId(artId: string): Promise<Like[]> {
    const likeIds = await this.pgConn.query(`SELECT * FROM "like" WHERE art_id = $1`, [artId]);

    return likeIds;
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
