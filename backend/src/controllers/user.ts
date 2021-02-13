import { BodyParam, Post, JsonController, UploadedFile } from 'routing-controllers';
import { Service } from 'typedi';
import { FileUploadOptionType, getFileUploadOptions } from './options/fileUploadOptions';
import { User } from '../db/entities';
import { UserService } from '../services';

@Service()
@JsonController('/users')
export default class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  async create(
    @UploadedFile('file', { options: getFileUploadOptions(FileUploadOptionType.Profile), required: true })
    file: Express.Multer.File,
    @BodyParam('username', { required: true }) username: string,
    @BodyParam('email', { required: true }) email: string,
    @BodyParam('about', { required: true }) about: string,
    @BodyParam('password', { required: true }) password: string
  ) {
    const user = {
      profileImage: file.filename,
      username,
      email,
      about,
      password,
    } as User;
    const created = await this.userService.save(user);

    created.password = undefined;
    created.salt = undefined;

    return created;
  }
}
