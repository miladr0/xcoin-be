import { validationMiddleware } from '@middlewares/validation.middleware';
import { Body, Controller, Get, Post, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import findOrCreateDto from './dtos/find-or-create.dto';
import ProfileService from './profile.service';
import { IProfile } from '@models/profiles.model';
import GetAllDocsDto from './dtos/get-all-docs';

@Controller('/v1/profiles')
export class ProfileController {
  private readonly profileService = new ProfileService();

  @Get('/')
  @OpenAPI({ summary: 'Return a list of profiles' })
  @ResponseSchema(IProfile, { isArray: true })
  @UseBefore(validationMiddleware(GetAllDocsDto, 'query'))
  async getProfiles(@QueryParam('limit') limit: number, @QueryParam('page') page: number) {
    const profiles = await this.profileService.findAll(limit, page);
    return { profiles };
  }

  @Post('/')
  @UseBefore(validationMiddleware(findOrCreateDto, 'body'))
  @OpenAPI({ summary: 'return a profile or create it' })
  @ResponseSchema(IProfile)
  async findOrCreate(@Body() userData: findOrCreateDto) {
    const profile = await this.profileService.findOrCreate(userData);

    return { profile };
  }
}
