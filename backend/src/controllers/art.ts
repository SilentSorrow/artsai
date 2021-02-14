import { BodyParam, Post, Req, JsonController, UseBefore, UploadedFile, Get, Param, Put } from 'routing-controllers';
import { Service } from 'typedi';
import { userAuth } from '../middlewares';
import { FileUploadOptionType, getFileUploadOptions } from './options/fileUploadOptions';
import { ArtService } from '../services';
import { ArtData, AppRequest } from '../types';

@Service()
@JsonController('/arts')
export default class ArtController {
  constructor(private artService: ArtService) {}

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
  @Put('/change-main-image/:id')
  async changeProfileImage(
    @UploadedFile('file', { options: getFileUploadOptions(FileUploadOptionType.Art), required: true })
    file: Express.Multer.File,
    @Param('id') id: string,
    @Req() req: AppRequest
  ) {
    return await this.artService.changeMainImage(file.filename, req.user, id);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.artService.getById(id);
  }
}
