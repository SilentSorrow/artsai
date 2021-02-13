import * as typeorm from 'typeorm';
import { UnauthorizedError } from 'routing-controllers';
import { Crypto, Validator } from '../utils';
import { AsyncRedis } from '../db';
import { User } from '../db/entities';

export default class AuthService {
  private userRepo: typeorm.Repository<User>;

  constructor(private pgConn: typeorm.Connection, private redisConn: AsyncRedis) {
    this.userRepo = this.pgConn.getRepository(User);
  }

  async login(username: string, password: string) {
    username = Validator.validateUsername(username);
    password = Validator.validatePassword(password);

    const user = await this.userRepo.findOne({ username });
    if (!user || !Crypto.checkPassword(password, user.password, user.salt)) {
      throw new UnauthorizedError(`Username and password combination didn't work`);
    }

    const token = Crypto.createRandomString();
    this.redisConn.setAsync(token, user.id);

    user.password = undefined;
    user.salt = undefined;

    return { user, token };
  }

  async sendCode() {}

  async verifyCode(code: string, user: User) {
    const userId = this.redisConn.getAsync(code);
    if (user !== userId) {
      throw new UnauthorizedError('Code is not recognized');
    }

    const updateData = await this.userRepo.update(user, { isVerified: true });

    return updateData;
  }

  generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
