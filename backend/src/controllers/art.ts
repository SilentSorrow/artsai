import {
  BodyParam,
  Post,
  Req,
  JsonController,
  UseBefore,
  UploadedFile,
  Get,
  Param,
  Put,
  Delete,
  UnauthorizedError,
  QueryParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import { userAuth } from '../middlewares';
import { getFileUploadOptions } from './options/fileUploadOptions';
import { ArtService, MediaService } from '../services';
import { ArtData, AppRequest } from '../types';

@Service()
@JsonController('/art')
export default class ArtController {
  constructor(private artService: ArtService, private mediaService: MediaService) {}

  @UseBefore(userAuth())
  @Post('/')
  async create(
    @UploadedFile('file', { options: getFileUploadOptions(), required: true })
    file: Express.Multer.File,
    @BodyParam('title', { required: true }) title: string,
    @BodyParam('description', { required: true }) description: string,
    @BodyParam('typeId', { required: true }) typeId: string,
    @BodyParam('subjectIds', { required: true }) subjectIds: string[],
    @BodyParam('tags', { required: true }) tags: string[],
    @Req() req: AppRequest
  ) {
    if (!req.user.isVerified) {
      throw new UnauthorizedError('You have to verify your account first');
    }

    const art = {
      title,
      description,
      typeId,
      subjectIds,
      tags,
      mainImage: file.filename,
    } as ArtData;

    return await this.artService.save(art, req.user);
  }

  @UseBefore(userAuth())
  @Delete('/:artId')
  async delete(@Param('artId') artId: string, @Req() req: AppRequest) {
    return await this.artService.delete(artId, req.user);
  }

  @Get('/top')
  async getTop() {
    return await this.artService.getTop();
  }

  @Get('/search')
  async search(
    @QueryParam('q', { required: true }) q: string,
    @QueryParam('options', { required: true }) options: string
  ) {
    return await this.artService.search(q, options.split(','));
  }

  @Get('/:userId')
  async getAllUserArt(@Param('userId') userId: string) {
    return await this.artService.getAllUserArt(userId);
  }

  @Get('/details/:artId')
  async getById(@Param('artId') artId: string) {
    return await this.artService.getById(artId);
  }

  @Get('/liked/:userId')
  async getLiked(@Param('userId') userId: string) {
    return await this.artService.getLiked(userId);
  }

  @Get('/details/:artId/likes')
  async getLikesByArtId(@Param('artId') artId: string) {
    return await this.mediaService.getLikesByArtId(artId);
  }

  @UseBefore(userAuth())
  @Put('/toggle-like/:artId')
  async toggleLike(@Param('artId') artId: string, @Req() req: AppRequest) {
    await this.mediaService.toggleLike(artId, req.user);

    return [];
  }

  @Get('/details/:artId/comments')
  async getComments(@Param('artId') artId: string) {
    return await this.mediaService.getComments(artId);
  }

  @UseBefore(userAuth())
  @Post('/comment/:artId')
  async postComment(
    @Param('artId') artId: string,
    @BodyParam('value', { required: true }) value: string,
    @Req() req: AppRequest
  ) {
    if (!req.user.isVerified) {
      throw new UnauthorizedError('You have to verify your account first');
    }

    return await this.mediaService.postComment(artId, req.user, value);
  }

  @UseBefore(userAuth())
  @Delete('/comment/:commentId')
  async deleteComment(@Param('commentId') commentId: string, @Req() req: AppRequest) {
    return await this.mediaService.deleteComment(commentId, req.user);
  }
}
