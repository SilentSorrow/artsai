import { BodyParam, Post, Req, JsonController, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { userAuth } from '../middlewares';
import { UserService } from '../services';
import { Art, User, Type } from '../db/entities';
import { ArtService } from '../services';

@Service()
@JsonController('/arts')
export default class ArtController {
  constructor(private artService: ArtService) {}

  @UseBefore(userAuth())
  @Post('/')
  async create(
    @BodyParam('title', { required: true }) title: string,
    @BodyParam('description', { required: true }) description: string,
    @BodyParam('mainImagePath', { required: true }) mainImagePath: string,
    @BodyParam('typeId', { required: true }) typeId: string,
    @BodyParam('subjectIds', { required: true }) subjectIds: string[],
    @BodyParam('tags', { required: true }) tags: string[],
    @Req() req: any
  ) {
    const art = {
      title,
      description,
      mainImagePath,
      typeId,
      subjectIds,
      tags,
      user: req.user,
    }; //

    return await this.artService.save(art);
  }
}
