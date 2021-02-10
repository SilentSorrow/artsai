import { BodyParam, Post, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { User } from '../db/entities';
import { UserService } from '../services';

@Service()
@JsonController('/users')
export default class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  async create(
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('email', { required: true }) email: string,
    @BodyParam('about', { required: true }) about: string,
    @BodyParam('profileImagePath', { required: true }) profileImagePath: string,
    @BodyParam('password', { required: true }) password: string
  ) {
    const user = {
      username,
      email,
      about,
      profileImagePath,
      password,
    } as User;
    const created = await this.userService.save(user);

    created.password = undefined;
    created.salt = undefined;

    return created;
  }
}
