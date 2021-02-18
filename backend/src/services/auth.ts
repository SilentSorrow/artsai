import * as typeorm from 'typeorm';
import { UnauthorizedError } from 'routing-controllers';
import { Crypto, Validator, omitUser } from '../utils';
import { AsyncRedis } from '../db';
import { User } from '../db/entities';
import { LoginData } from '../types';

export default class AuthService {
  private userRepo: typeorm.Repository<User>;

  constructor(private pgConn: typeorm.Connection, private redisConn: AsyncRedis) {
    this.userRepo = this.pgConn.getRepository(User);
  }

  async login(username: string, password: string): Promise<LoginData> {
    username = Validator.validateUsername(username);
    password = Validator.validatePassword(password);

    const user = await this.userRepo.findOne({ username });
    if (!user || !Crypto.checkPassword(password, user.password, user.salt)) {
      throw new UnauthorizedError(`Username and password combination didn't work`);
    }

    const token = Crypto.createRandomString();
    this.redisConn.setAsync(token, user.id, 'EX', Number(process.env.TOKEN_EXP_TIME));

    return { user: omitUser(user), token } as LoginData;
  }

  async sendCode(user: User): Promise<boolean> {
    const code = this.generateRandomCode();
    this.redisConn.setAsync(String(code), user.id, 'EX', Number(process.env.CODE_EXP_TIME));

    //send code(later...)

    return true;
  }

  async verifyCode(code: string, user: User): Promise<boolean> {
    const userId = await this.redisConn.getAsync(code);
    if (user.id !== userId) {
      throw new UnauthorizedError('Code is not recognized');
    }

    await this.userRepo.update(user, { isVerified: true });
    this.redisConn.delAsync(code);

    return true;
  }

  generateRandomCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
