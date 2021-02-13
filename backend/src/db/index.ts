import * as typeorm from 'typeorm';
import * as redis from 'redis';
import { promisify } from 'util';
import { Art, Subject, Tag, Type, User } from './entities';
import { Subject1613170754165, Type1613165728381 } from './seeds';

const createPgConnection = async (connOptions: typeorm.ConnectionOptions): Promise<typeorm.Connection> => {
  const options = {
    ...connOptions,
    entities: [Art, Subject, Tag, Type, User],
    migrations: [Subject1613170754165, Type1613165728381],
  };

  const pgConn = await typeorm.createConnection(options);
  await pgConn.runMigrations();

  return pgConn;
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
