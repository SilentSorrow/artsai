import { BodyParam, Post, Req, JsonController, UseBefore, UploadedFile } from 'routing-controllers';
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
}
