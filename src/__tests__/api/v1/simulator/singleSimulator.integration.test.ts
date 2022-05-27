import supertest, { SuperTest, Test } from 'supertest';
import { Types } from 'mongoose';

import App from '@app';
import { SimulatorControllerV1 } from '@v1/index';
import { clearDB } from '@__tests__/jest/db';
import { profileFactory, simulatorFactory } from '@__tests__/jest/factories';

let server: SuperTest<Test>;

const baseUrl = '/api/v1/simulators';

describe('single simulator test suit', () => {
  beforeEach(async () => {
    await clearDB();
    const app = new App([SimulatorControllerV1]);
    server = supertest(app.getServer());
  });

  test('return a simulator with profile_id', async () => {
    const profile = await profileFactory();
    const simulator = await simulatorFactory({ profile_id: profile.id });

    await server
      .get(`${baseUrl}/${profile._id}`)
      .query({
        page: 1,
        limit: 1,
      })
      .expect(200)
      .expect({
        simulator: JSON.parse(JSON.stringify(simulator)),
      });
  });

  test('return null with fake profile_id', async () => {
    const profile = await profileFactory();
    await simulatorFactory({ profile_id: profile.id });

    await server
      .get(`${baseUrl}/${new Types.ObjectId()}`)
      .query({
        page: 1,
        limit: 1,
      })
      .expect(200)
      .expect({
        simulator: null,
      });
  });
});
