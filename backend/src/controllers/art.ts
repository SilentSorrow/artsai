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
}
