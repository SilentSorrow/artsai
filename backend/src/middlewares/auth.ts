import * as typeorm from 'typeorm';
import { Request, Response } from 'express';
import Container from 'typedi';
import { UnauthorizedError } from 'routing-controllers';
import { DEFAULT_PG_CONN_NAME, DEFAULT_REDIS_CONN_NAME } from '../app/constants';
import { AsyncRedis } from '../db';
import { User } from '../db/entities';

const getPgConnection = () => {
  return Container.get(DEFAULT_PG_CONN_NAME) as typeorm.Connection;
};

const getRedisConnection = () => {
  return Container.get(DEFAULT_REDIS_CONN_NAME) as AsyncRedis;
};

const authMiddleware = (relations: string[]) => {
  async (req: Request, res: Response, next?: (err?: any) => any) => {
    try {
      const token = req.headers['app-auth'];

      const redisConn = getRedisConnection();
      const userId = redisConn.getAsync(token);

      const pgConn = getPgConnection();
      const user = await pgConn.getRepository(User).findOne(userId, { relations });
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      req['user'] = user;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const userAuth = (relations: string[] = []) => {
  return authMiddleware(relations);
};
