import * as typeorm from 'typeorm';
import * as redis from 'redis';
import { promisify } from 'util';
import { Art, User } from './entities';

const createPgConnection = async (connOptions: typeorm.ConnectionOptions): Promise<typeorm.Connection> => {
  const options = {
    ...connOptions,
    entities: [Art, User],
    migrations: [],
  };

  return await typeorm.createConnection(options);
};

const createRedisConnection = (connOptions: redis.ClientOpts): AsyncRedis => {
  return new AsyncRedis(connOptions);
};

class AsyncRedis extends redis.RedisClient {
  public readonly getAsync = promisify(this.get).bind(this);
  public readonly setAsync = promisify(this.set).bind(this);
  public readonly delAsync = promisify(this.del).bind(this);
}

export { createPgConnection, createRedisConnection, AsyncRedis };
