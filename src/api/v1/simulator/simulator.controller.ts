import { validationMiddleware } from '@middlewares/validation.middleware';
import { Body, Controller, Get, Param, Post, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import CreateSimulatorDto from './dtos/create-simulator.dto';
import ProfileIdDto from './dtos/profile-id.dto';
import SimulatorService from './simulator.service';
import { ISimulator } from '@models/simulators.model';
import GetAllDocsDto from './dtos/get-all-docs';

@Controller('/v1/simulators')
export class SimulatorController {
  private readonly simulatorService = new SimulatorService();

  @Get('/')
  @OpenAPI({ summary: 'Return a list of simulators' })
  @ResponseSchema(ISimulator, { isArray: true })
  @UseBefore(validationMiddleware(GetAllDocsDto, 'query'))
  async getSimulators(@QueryParam('limit') limit: number, @QueryParam('page') page: number) {
    const simulators = await this.simulatorService.findAll(limit, page);
    return { simulators };
  }

  @Get('/:profile_id')
  @UseBefore(validationMiddleware(ProfileIdDto, 'params'))
  @OpenAPI({ summary: 'return a simulator by profile_id' })
  @ResponseSchema(ISimulator)
  async getByProfileId(@Param('profile_id') profileId: string) {
    const simulator = await this.simulatorService.getByProfileId(profileId);

    return { simulator };
  }

  @Post('/:profile_id')
  @UseBefore(validationMiddleware(ProfileIdDto, 'params'))
  @UseBefore(validationMiddleware(CreateSimulatorDto, 'body'))
  @OpenAPI({ summary: 'create a simulator' })
  @ResponseSchema(ISimulator)
  async create(@Param('profile_id') profileId: string, @Body() userData: CreateSimulatorDto) {
    const simulator = await this.simulatorService.create(profileId, userData);

    return { simulator };
  }
}
