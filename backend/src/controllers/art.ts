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
import { FileUploadOptionType, getFileUploadOptions } from './options/fileUploadOptions';
import { ArtService, MediaService } from '../services';
import { ArtData, AppRequest } from '../types';

@Service()
@JsonController('/art')
export default class ArtController {
  constructor(private artService: ArtService, private mediaService: MediaService) {}

  @UseBefore(userAuth())
  @Post('/')
  async create(
    @UploadedFile('file', { options: getFileUploadOptions(FileUploadOptionType.Art), required: true })
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
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req: AppRequest) {
    return await this.artService.delete(id, req.user);
  }

  @Get('/top')
  async getTop() {
    return await this.artService.getTop();
  }

  @Get('/details/:id')
  async getById(@Param('id') id: string) {
    return await this.artService.getById(id);
  }

  @Get('/details/:id/likes')
  async getLikesByArtId(@Param('id') id: string) {
    return await this.mediaService.getLikesByArtId(id);
  }

  @UseBefore(userAuth())
  @Put('/toggle-like/:id')
  async toggleLike(@Param('id') id: string, @Req() req: AppRequest) {
    await this.mediaService.toggleLike(id, req.user);

    return [];
  }
}
