import * as typeorm from 'typeorm';
import Container from 'typedi';
import { NextFunction, Response } from 'express';
import { UnauthorizedError } from 'routing-controllers';
import { DEFAULT_PG_CONN_NAME, DEFAULT_REDIS_CONN_NAME } from '../app/constants';
import { AsyncRedis } from '../db';
import { User } from '../db/entities';
import { AppRequest } from '../types';

const getPgConnection = (): typeorm.Connection => {
  return Container.get(DEFAULT_PG_CONN_NAME);
};

const getRedisConnection = (): AsyncRedis => {
  return Container.get(DEFAULT_REDIS_CONN_NAME);
};

const authMiddleware = (relations: string[]): Function => {
  return async (req: AppRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers['app-auth'];
      if (!token) {
        throw new UnauthorizedError('Token is not recognized');
      }

      const redisConn = getRedisConnection();
      const userId = await redisConn.getAsync(token as string);

      const pgConn = getPgConnection();
      const user = await pgConn.getRepository(User).findOne(userId as string, { relations });
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

export const userAuth = (relations: string[] = []): Function => {
  return authMiddleware(relations);
};
