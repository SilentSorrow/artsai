import * as typeorm from 'typeorm';
import fs from 'fs';
import { IMG_DIRECTORY_PATH } from '../app/constants';
import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import { User, Like, Follow, Comment } from '../db/entities';
import { omitUser } from '../utils';

export default class MediaService {
  private likeRepo: typeorm.Repository<Like>;
  private followRepo: typeorm.Repository<Follow>;
  private commentRepo: typeorm.Repository<Comment>;

  constructor(private pgConn: typeorm.Connection) {
    this.likeRepo = this.pgConn.getRepository(Like);
    this.followRepo = this.pgConn.getRepository(Follow);
    this.commentRepo = this.pgConn.getRepository(Comment);
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

  async getComments(artId: string): Promise<Comment[]> {
    const comments = await this.commentRepo.find({
      where: {
        art: {
          id: artId,
        },
      },
      relations: ['art', 'user'],
    });

    comments.forEach((comment) => (comment.user = omitUser(comment.user as User)));

    return comments;
  }

  async postComment(artId: string, user: User, value: string): Promise<Comment> {
    const comment = {
      value,
      art: { id: artId },
      user: { id: user.id },
    };

    return this.commentRepo.save(comment);
  }

  async deleteComment(commentId: string, user: User): Promise<Comment | undefined> {
    const comment = await this.commentRepo.findOne({ id: commentId }, { relations: ['user'] });
    if (!comment) {
      return comment;
    }
    if (comment.user.id !== user.id) {
      throw new UnauthorizedError('You are not authorized to make this action');
    }

    const { user: u, ...rest } = await this.commentRepo.remove(comment as Comment);

    return rest as Comment;
  }
}
