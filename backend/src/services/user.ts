import * as typeorm from 'typeorm';
import { Crypto, Validator } from '../utils';
import { ValidationError } from '../errors';
import { User } from '../db/entities';

export default class UserService {
  private userRepo: typeorm.Repository<User>;

  constructor(private pgConn: typeorm.Connection) {
    this.userRepo = this.pgConn.getRepository(User);
  }

  async save(user: User) {
    user.username = Validator.validateUsername(user.username);
    user.password = Validator.validatePassword(user.password);
    if (!Validator.isEmailValid(user.email)) {
      throw new ValidationError('Email validation error');
    }

    const { hash, salt } = Crypto.hashPassword(user.password);
    user.password = hash;
    user.salt = salt;

    let saved = undefined;
    try {
      saved = await this.userRepo.save(user);
    } catch (err) {
      throw new ValidationError('Invalid user data', err.message);
    }

    return saved;
  }

  async getByUsername(username: string) {
    const user = await this.userRepo.findOne(username);

    user.password = undefined;
    user.salt = undefined;

    return user;
  }
}
