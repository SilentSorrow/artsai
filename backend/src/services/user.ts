import * as typeorm from 'typeorm';
import * as fs from 'fs';
import { Crypto, Validator } from '../utils';
import { ValidationError } from '../errors';
import { User } from '../db/entities';
import { OmmitedUser } from '../types';

export default class UserService {
  private userRepo: typeorm.Repository<User>;

  constructor(private pgConn: typeorm.Connection) {
    this.userRepo = this.pgConn.getRepository(User);
  }

  async save(user: User): Promise<OmmitedUser> {
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

    return saved as OmmitedUser;
  }

  async changeProfileImage(profileImage: string, user: User): Promise<OmmitedUser> {
    await this.userRepo.update(user, { profileImage });

    const prevImg = (await this.userRepo.findOne(user)).profileImage;
    if (prevImg) {
      fs.unlinkSync(`${process.cwd()}'../img/profile/'${prevImg}`);
    }

    user.profileImage = profileImage;

    return user as OmmitedUser;
  }

  async getByUsername(username: string): Promise<OmmitedUser> {
    const user = await this.userRepo.findOne(username);

    return user as OmmitedUser;
  }
}
