import { BodyParam, Post, Put, Req, JsonController, UseBefore, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { userAuth } from '../middlewares';
import { AuthService } from '../services';
import { AppRequest } from '../types';

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
  @Get('/send-code')
  async sendCode(@Req() req: AppRequest) {
    return await this.authService.sendCode(req.user);
  }

  @UseBefore(userAuth())
  @Put('/verify-code')
  async verifyCode(@BodyParam('code', { required: true }) code: string, @Req() req: AppRequest) {
    return await this.authService.verifyCode(code, req.user);
  }
}
