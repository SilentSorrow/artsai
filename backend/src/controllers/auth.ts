import { BodyParam, Post, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthService } from '../services';

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
}
