import supertest, { SuperTest, Test } from 'supertest';
import { Types } from 'mongoose';
import { orderBy } from 'lodash';
import App from '@app';
import { FavoriteControllerV1 } from '@v1/index';
import { clearDB } from '@__tests__/jest/db';
import { favoriteFactory, profileFactory } from '@__tests__/jest/factories';

let server: SuperTest<Test>;

const baseUrl = '/api/v1/favorites';

describe('favorite test suit', () => {
  beforeEach(async () => {
    await clearDB();
    const app = new App([FavoriteControllerV1]);
    server = supertest(app.getServer());
  });

  test('should return empty array of favorites', async () => {
    await server
      .get(baseUrl)
      .query({
        page: 0,
        limit: 10,
      })
      .expect(200)
      .expect({
        favorites: {
          docs: [],
          meta: { totalDocs: 0, totalPages: 0, page: 0 },
        },
      });
  });

  test('should return array of favorites with pagination', async () => {
    const favorites = [await favoriteFactory(), await favoriteFactory(), await favoriteFactory(), await favoriteFactory()];
    const favoritesSorted = orderBy(JSON.parse(JSON.stringify(favorites)), ['createdAt'], 'desc');

    await server
      .get(baseUrl)
      .query({
        page: 0,
        limit: 10,
      })
      .expect(200)
      .expect({
        favorites: {
          docs: favoritesSorted,
          meta: { totalDocs: favorites.length, totalPages: 1, page: 0 },
        },
      });
  });

  test('should return empty array for next page when favorites less than first limit', async () => {
    const favorites = [await favoriteFactory(), await favoriteFactory(), await favoriteFactory(), await favoriteFactory()];

    await server
      .get(baseUrl)
      .query({
        page: 1,
        limit: 10,
      })
      .expect(200)
      .expect({
        favorites: {
          docs: [],
          meta: { totalDocs: favorites.length, totalPages: 1, page: 1 },
        },
      });
  });

  test('should return array for next page when favorites more than limit', async () => {
    const favorites = [await favoriteFactory(), await favoriteFactory(), await favoriteFactory(), await favoriteFactory()];
    const favoritesSorted = orderBy(JSON.parse(JSON.stringify(favorites.slice(2, 3))), ['createdAt'], 'desc');

    await server
      .get(baseUrl)
      .query({
        page: 1,
        limit: 1,
      })
      .expect(200)
      .expect({
        favorites: {
          docs: favoritesSorted,
          meta: { totalDocs: favorites.length, totalPages: 4, page: 1 },
        },
      });
  });

  test('return favorite with profile_id', async () => {
    const profile = await profileFactory();
    const favorite = await favoriteFactory({ profile_id: profile.id });

    await server
      .get(`${baseUrl}/${profile._id}`)
      .query({
        page: 1,
        limit: 1,
      })
      .expect(200)
      .expect({
        favorite: JSON.parse(JSON.stringify(favorite)),
      });
  });

  test('return null with fake profile_id', async () => {
    const profile = await profileFactory();
    await favoriteFactory({ profile_id: profile.id });

    await server
      .get(`${baseUrl}/${new Types.ObjectId()}`)
      .query({
        page: 1,
        limit: 1,
      })
      .expect(200)
      .expect({
        favorite: null,
      });
  });
});
