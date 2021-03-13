import * as typeorm from 'typeorm';
import fs from 'fs';
import { IMG_DIRECTORY_PATH } from '../app/constants';
import { BadRequestError } from 'routing-controllers';
import { User, Like, Follow } from '../db/entities';
import { omitUser } from '../utils';
import { OmitedUser } from 'src/types';

export default class MediaService {
  private likeRepo: typeorm.Repository<Like>;
  private followRepo: typeorm.Repository<Follow>;

  constructor(private pgConn: typeorm.Connection) {
    this.likeRepo = this.pgConn.getRepository(Like);
    this.followRepo = this.pgConn.getRepository(Follow);
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

  async getFollows(userId: string, whereField: string): Promise<Follow[]> {
    const follows = await this.followRepo.find({
      where: {
        [whereField]: {
          id: userId,
        },
      },
      relations: ['user', 'follower'],
    });

    return follows;
  }

  async isFollowing(follower: User, userId: string): Promise<boolean> {
    const follow = await this.followRepo.findOne({
      where: {
        follower: {
          id: follower.id,
        },
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });

    return follow ? true : false;
  }

  async toggleFollow(follower: User, userId: string): Promise<void> {
    try {
      const follow = await this.followRepo.findOne({
        where: {
          follower: {
            id: follower.id,
          },
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

      if (follow) {
        await this.followRepo.remove(follow);
      } else {
        await this.pgConn.query(`INSERT INTO follow(follower_id, user_id) VALUES($1, $2)`, [follower.id, userId]);
      }
    } catch (err) {
      console.log(err);
      throw new BadRequestError('Something went wrong...');
    }
  }
}
