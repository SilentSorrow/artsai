import { BodyParam, Param, Post, Put, Req, JsonController, UseBefore, Get, Delete } from 'routing-controllers';
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
  @Delete('/logout')
  async logout(@Req() req: AppRequest) {
    return await this.authService.logout(req.token);
  }

  @UseBefore(userAuth())
  @Get('/send-code')
  async sendCode(@Req() req: AppRequest) {
    return await this.authService.sendCode(req.user);
  }

  @UseBefore(userAuth())
  @Put('/verify-code/:code')
  async verifyCode(@Param('code') code: string, @Req() req: AppRequest) {
    return await this.authService.verifyCode(code, req.user);
  }

  @UseBefore(userAuth())
  @Get('/check-token')
  async checkToken(@Req() req: AppRequest) {
    return await this.authService.checkToken(req.token);
  }
}
