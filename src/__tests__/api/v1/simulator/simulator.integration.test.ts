import supertest, { SuperTest, Test } from 'supertest';
import { orderBy } from 'lodash';
import App from '@app';
import { SimulatorControllerV1 } from '@v1/index';
import { clearDB } from '@__tests__/jest/db';
import { simulatorFactory } from '@__tests__/jest/factories';

let server: SuperTest<Test>;

const baseUrl = '/api/v1/simulators';

describe('simulator test suit', () => {
  beforeEach(async () => {
    await clearDB();
    const app = new App([SimulatorControllerV1]);
    server = supertest(app.getServer());
  });

  test('should return empty array of simulators', async () => {
    await server
      .get(baseUrl)
      .query({
        page: 0,
        limit: 10,
      })
      .expect(200)
      .expect({
        simulators: {
          docs: [],
          meta: { totalDocs: 0, totalPages: 0, page: 0 },
        },
      });
  });

  test('should return array of simulators with pagination', async () => {
    const simulators = [await simulatorFactory(), await simulatorFactory(), await simulatorFactory(), await simulatorFactory()];
    const simulatorsSorted = orderBy(JSON.parse(JSON.stringify(simulators)), ['createdAt'], 'desc');

    await server
      .get(baseUrl)
      .query({
        page: 0,
        limit: 10,
      })
      .expect(200)
      .expect({
        simulators: {
          docs: simulatorsSorted,
          meta: { totalDocs: simulators.length, totalPages: 1, page: 0 },
        },
      });
  });

  test('should return empty array for next page when simulators less than first limit', async () => {
    const simulators = [await simulatorFactory(), await simulatorFactory(), await simulatorFactory(), await simulatorFactory()];

    await server
      .get(baseUrl)
      .query({
        page: 1,
        limit: 10,
      })
      .expect(200)
      .expect({
        simulators: {
          docs: [],
          meta: { totalDocs: simulators.length, totalPages: 1, page: 1 },
        },
      });
  });
});
