import { BodyParam, Post, Req, JsonController, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { userAuth } from '../middlewares';
import { ArtService } from '../services';
import { User } from '../db/entities';
import { ArtData, AppRequest } from '../types';

@Service()
@JsonController('/arts')
export default class ArtController {
  constructor(private artService: ArtService) {}

  @UseBefore(userAuth())
  @Post('/')
  async create(
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
      mainImage,
      typeId,
      subjectIds,
      tags,
    } as ArtData;

    return await this.artService.save(art, req.user as User);
  }
}
