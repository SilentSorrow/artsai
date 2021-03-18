import { JsonController, Get, Param } from 'routing-controllers';
import { Service } from 'typedi';
import { MediaService } from '../services';

@Service()
@JsonController('/images')
export default class ImageController {
  constructor(private mediaService: MediaService) {}

  @Get('/:imageFileName')
  async getImage(@Param('imageFileName') imageFileName: string) {
    return this.mediaService.getImage(imageFileName);
  }
}
