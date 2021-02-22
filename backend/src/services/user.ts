import * as typeorm from 'typeorm';
import * as fs from 'fs';
import { IMG_DIRECTORY_PATH } from '../app/constants';
import { Crypto, Validator, omitUser } from '../utils';
import { ValidationError } from '../errors';
import { User } from '../db/entities';
import { OmitedUser } from '../types';

export default class UserService {
  private userRepo: typeorm.Repository<User>;

  constructor(private pgConn: typeorm.Connection) {
    this.userRepo = this.pgConn.getRepository(User);
  }

  async save(user: User): Promise<OmitedUser> {
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

    return omitUser(saved);
  }

  async changeProfileImage(profileImage: string, user: User): Promise<OmitedUser> {
    const oldUser = await this.userRepo.findOne({ id: user.id });
    if (oldUser?.profileImage) {
      fs.unlinkSync(`${process.cwd()}/${IMG_DIRECTORY_PATH}/${oldUser?.profileImage}`);
    }
    await this.userRepo.update({ id: user.id }, { profileImage });

    user.profileImage = profileImage;

    return omitUser(user);
  }

  async getByUsername(username: string): Promise<OmitedUser | undefined> {
    const user = await this.userRepo.findOne({ username });
    if (user) {
      return omitUser(user as User);
    }

    return user;
  }
}
