import { BodyParam, Post, Put, Req, JsonController, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { userAuth } from '../middlewares';
import { AuthService } from '../services';
import { User } from '../db/entities';

@Service()
@JsonController('/auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('password', { required: true }) password: string
  ) {
    return await this.authService.login(username, password);
  }

  @UseBefore(userAuth())
  @Put('/verify-code')
  async verifyCode(@BodyParam('code', { required: true }) code: string, @Req() req: any) {
    const user = req.user as User;

    return await this.authService.verifyCode(code, user);
  }
}
