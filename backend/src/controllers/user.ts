import { BodyParam, Post, JsonController, UploadedFile, Put, UseBefore, Req, Get, Param } from 'routing-controllers';
import { Service } from 'typedi';
import { userAuth } from '../middlewares';
import { FileUploadOptionType, getFileUploadOptions } from './options/fileUploadOptions';
import { User } from '../db/entities';
import { UserService } from '../services';
import { AppRequest } from '../types';

@Service()
@JsonController('/users')
export default class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  async create(
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('email', { required: true }) email: string,
    @BodyParam('about', { required: true }) about: string,
    @BodyParam('password', { required: true }) password: string
  ) {
    const user = {
      username,
      email,
      about,
      password,
    } as User;
    const created = await this.userService.save(user);

    return created;
  }

  @Get('/:username')
  async getByUsername(@Param('username') username: string) {
    return await this.userService.getByUsername(username);
  }

  @UseBefore(userAuth())
  @Put('/change-profile-image')
  async changeProfileImage(
    @UploadedFile('file', { options: getFileUploadOptions(FileUploadOptionType.Profile), required: true })
    file: Express.Multer.File,
    @Req() req: AppRequest
  ) {
    return await this.userService.changeProfileImage(file.filename, req.user);
  }
}
