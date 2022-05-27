import supertest, { SuperTest, Test } from 'supertest';
import { orderBy } from 'lodash';
import App from '@app';
import { ProfileControllerV1 } from '@v1/index';
import { clearDB } from '@__tests__/jest/db';
import { profileFactory } from '@__tests__/jest/factories';
import { faker } from '@faker-js/faker';

let server: SuperTest<Test>;

const baseUrl = '/api/v1/profiles';

describe('profile test suit', () => {
  beforeEach(async () => {
    await clearDB();
    const app = new App([ProfileControllerV1]);
    server = supertest(app.getServer());
  });

  test('should return empty array of profiles', async () => {
    await server
      .get(baseUrl)
      .query({
        page: 0,
        limit: 10,
      })
      .expect(200)
      .expect({
        profiles: {
          docs: [],
          meta: { totalDocs: 0, totalPages: 0, page: 0 },
        },
      });
  });

  test('should return array of profiles with pagination', async () => {
    const profiles = [await profileFactory(), await profileFactory(), await profileFactory(), await profileFactory()];
    const profilesSorted = orderBy(JSON.parse(JSON.stringify(profiles)), ['createdAt'], 'desc');

    await server
      .get(baseUrl)
      .query({
        page: 0,
        limit: 10,
      })
      .expect(200)
      .expect({
        profiles: {
          docs: profilesSorted,
          meta: { totalDocs: profiles.length, totalPages: 1, page: 0 },
        },
      });
  });

  test('should return empty array for next page when profiles less than first limit', async () => {
    const profiles = [await profileFactory(), await profileFactory(), await profileFactory(), await profileFactory()];

    await server
      .get(baseUrl)
      .query({
        page: 1,
        limit: 10,
      })
      .expect(200)
      .expect({
        profiles: {
          docs: [],
          meta: { totalDocs: profiles.length, totalPages: 1, page: 1 },
        },
      });
  });

  test('create new profile', async () => {
    const newProfile = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      nickname: faker.name.firstName(),
    };

    const { body } = await server.post(baseUrl).send(newProfile).expect(200);

    expect(body).toMatchObject({ profile: newProfile });
  });

  test('validation error when create new profile', async () => {
    const newProfile = {
      email: 'wrong_email',
      name: faker.name.firstName(),
      nickname: faker.name.firstName(),
    };

    const { body } = await server.post(baseUrl).send(newProfile).expect(400);

    expect(body).toMatchObject({ message: 'email must be an email' });
  });

  test('return existing profile instead of create new one', async () => {
    const newProfile = {
      email: faker.internet.email(),
      name: faker.name.firstName(),
      nickname: faker.name.firstName(),
    };

    const profile = await profileFactory(newProfile);

    await server
      .post(baseUrl)
      .send(newProfile)
      .expect(200)
      .expect({ profile: JSON.parse(JSON.stringify(profile)) });
  });
});
