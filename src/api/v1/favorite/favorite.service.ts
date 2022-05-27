import CRUD from '@common/interfaces/crud.interface';
import Favorites, { IFavoriteSchema } from '@models/favorites.model';

export default class FavoriteService implements CRUD<IFavoriteSchema> {
  private readonly favoriteModel = Favorites;

  async findAll(limit = 10, page = 0) {
    const query = {};
    const totalDocs = await this.favoriteModel.countDocuments(query);
    const docs = await this.favoriteModel
      .find(query)
      .limit(limit)
      .skip(limit * page)
      .sort({ createdAt: -1 })
      .lean();

    return {
      docs: JSON.parse(JSON.stringify(docs)),
      meta: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit) || 0,
        page,
      },
    };
  }

  async getById(id: string): Promise<IFavoriteSchema> {
    return this.favoriteModel.findById(id);
  }

  async getByProfileId(profileId: string): Promise<IFavoriteSchema> {
    const fav = await this.favoriteModel.findOne({ profile_id: profileId }).lean();
    return JSON.parse(JSON.stringify(fav));
  }
}
