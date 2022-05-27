import { Get, JsonController, Param, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { IFavorite } from '@models/favorites.model';
import { validationMiddleware } from '@middlewares/validation.middleware';
import ProfileIdDto from './dtos/profile-id.dto';
import GetAllDocsDto from './dtos/get-all-docs';
import FavoriteService from './favorite.service';

@JsonController('/v1/favorites')
export class FavoriteController {
  private readonly favoriteService = new FavoriteService();

  @Get('/')
  @OpenAPI({ summary: 'Return a list of favorites with pagination' })
  @ResponseSchema(IFavorite, {
    isArray: true,
  })
  @UseBefore(validationMiddleware(GetAllDocsDto, 'query'))
  async getFavorites(
    @QueryParam('limit') limit: number,

    @QueryParam('page') page: number,
  ) {
    const favorites = await this.favoriteService.findAll(limit, page);
    return { favorites };
  }

  @Get('/:profile_id')
  @OpenAPI({ summary: 'return a favorite by profile_id' })
  @ResponseSchema(IFavorite)
  @UseBefore(validationMiddleware(ProfileIdDto, 'params'))
  async getByProfileId(@Param('profile_id') profileId: string) {
    const favorite = await this.favoriteService.getByProfileId(profileId);

    return { favorite };
  }
}
