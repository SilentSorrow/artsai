import * as typeorm from 'typeorm';
import * as fs from 'fs';
import { IMG_DIRECTORY_PATH } from '../app/constants';
import { Crypto, Validator, omitUser } from '../utils';
import { ValidationError } from '../errors';
import { AuthService } from '.';
import { User } from '../db/entities';
import { OmitedUser, LoginData } from '../types';

export default class UserService {
  private userRepo: typeorm.Repository<User>;

  constructor(private pgConn: typeorm.Connection, private authService: AuthService) {
    this.userRepo = this.pgConn.getRepository(User);
  }

  async save(user: User): Promise<LoginData> {
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

    return this.authService.setToken(user);
  }

  async update(user: User): Promise<any> {
    user.username = Validator.validateUsername(user.username);

    return await this.userRepo.update({ id: user.id }, { username: user.username, about: user.about });
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

  async changeBackgroundImage(backgroundImage: string, user: User): Promise<OmitedUser> {
    const oldUser = await this.userRepo.findOne({ id: user.id });
    if (oldUser?.backgroundImage) {
      fs.unlinkSync(`${process.cwd()}/${IMG_DIRECTORY_PATH}/${oldUser?.backgroundImage}`);
    }
    await this.userRepo.update({ id: user.id }, { backgroundImage });

    user.backgroundImage = backgroundImage;

    return omitUser(user);
  }

  async getByUsername(username: string): Promise<OmitedUser | undefined> {
    const user = await this.userRepo.findOne({ username });
    if (user) {
      return omitUser(user as User);
    }

    return user;
  }

  async delete(user: User): Promise<User> {
    return await this.userRepo.remove(user);
  }
}
