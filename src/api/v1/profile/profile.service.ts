import CRUD from '@common/interfaces/crud.interface';
import Profile, { IProfileSchema } from '@models/profiles.model';
import findOrCreateDto from './dtos/find-or-create.dto';

export default class ProfileService implements CRUD<IProfileSchema> {
  private readonly profileModel = Profile;

  async findAll(limit: number, page: number) {
    const query = {};
    const totalDocs = await this.profileModel.countDocuments(query);
    const docs = await this.profileModel
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
    return this.profileModel.findById(id);
  }

  async getByProfileId(profileId: string): Promise<IProfileSchema> {
    return this.profileModel.findOne({ profile_id: profileId });
  }

  async findOrCreate(userData: findOrCreateDto): Promise<IProfileSchema> {
    const { email, name, nickname } = userData;
    let profile = await this.profileModel.findOne({
      $or: [{ email }, { nickname }],
    });

    if (!profile) {
      profile = await this.profileModel.create({ email, name, nickname });
    }

    return JSON.parse(JSON.stringify(profile));
  }
}
