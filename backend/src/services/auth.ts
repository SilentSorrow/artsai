import * as typeorm from 'typeorm';
import { UnauthorizedError } from 'routing-controllers';
import { Crypto } from '../utils';
import { AsyncRedis } from '../db';
import { User } from '../db/entities';

export default class AuthService {
  private userRepo: typeorm.Repository<User>;

  constructor(private pgConn: typeorm.Connection, private redisConn: AsyncRedis) {
    this.userRepo = this.pgConn.getRepository(User);
  }

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({ username });

    if (!user || !Crypto.checkPassword(password, user.password, user.salt)) {
      throw new UnauthorizedError(`That username and password combination didn't work. Try again`);
    }

    const token = Crypto.createRandomString();
    this.redisConn.setAsync(token, user.id);

    user.password = undefined;
    user.salt = undefined;

    return { user, token };
  }
}
