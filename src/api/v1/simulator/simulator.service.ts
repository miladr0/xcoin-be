import CRUD from '@common/interfaces/crud.interface';
import Simulator, { ISimulator } from '@models/simulators.model';
import CreateSimulatorDto from './dtos/create-simulator.dto';

export default class SimulatorService implements CRUD<ISimulator> {
  private readonly simulatorModel = Simulator;

  async findAll(limit: number, page: number) {
    const query = {};
    const totalDocs = await this.simulatorModel.countDocuments(query);
    const docs = await this.simulatorModel
      .find(query)
      .limit(limit)
      .skip(limit * page)
      .lean()
      .sort({ createdAt: -1 });

    return {
      docs: JSON.parse(JSON.stringify(docs)),
      meta: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit) || 0,
        page,
      },
    };
  }

  async getById(id: string) {
    return this.simulatorModel.findById(id);
  }

  async getByProfileId(profileId: string): Promise<ISimulator> {
    const profile = await this.simulatorModel.findOne({
      profile_id: profileId,
    });
    return JSON.parse(JSON.stringify(profile));
  }

  async create(profileId, userData: CreateSimulatorDto): Promise<ISimulator> {
    const profile = await this.simulatorModel.create({
      ...userData,
      profile_id: profileId,
    });
    return JSON.parse(JSON.stringify(profile));
  }
}
