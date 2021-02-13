import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { CatalogService } from '../services';

@Service()
@JsonController('/catalogs')
export default class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get('/art-subjects')
  async getSubjects() {
    return await this.catalogService.getSubjects();
  }

  @Get('/art-types')
  async getTypes() {
    return await this.catalogService.getTypes();
  }
}
