import supertest, { SuperTest, Test } from 'supertest';
import App from '@app';
import { SimulatorControllerV1 } from '@v1/index';
import { clearDB } from '@__tests__/jest/db';
import { profileFactory } from '@__tests__/jest/factories';
import { faker } from '@faker-js/faker';

let server: SuperTest<Test>;

const baseUrl = '/api/v1/simulators';

describe('post simulator test suit', () => {
  beforeEach(async () => {
    await clearDB();
    const app = new App([SimulatorControllerV1]);
    server = supertest(app.getServer());
  });

  test('create new simulator', async () => {
    const profile = await profileFactory();

    const newSimulator = {
      dateRecorded: new Date().toISOString(),
      cryptocurrency: 'cryptocurrency',
      euros: faker.random.numeric(3),
      price: faker.random.numeric(3),
      quantity: faker.random.numeric(3),
    };

    const { body } = await server.post(`${baseUrl}/${profile._id}`).send(newSimulator).expect(200);

    expect(body).toMatchObject({
      simulator: {
        ...newSimulator,
        euros: { $numberDecimal: newSimulator.euros },
        price: { $numberDecimal: newSimulator.price },
        quantity: { $numberDecimal: newSimulator.quantity },
        profile_id: profile._id.toString(),
      },
    });
  });

  test('validation error when create new simulator', async () => {
    const profile = await profileFactory();

    const newSimulator = {
      dateRecorded: new Date().toISOString(),
      cryptocurrency: 123,
      euros: faker.random.numeric(3),
      price: faker.random.numeric(3),
      quantity: faker.random.numeric(3),
    };

    const { body } = await server.post(`${baseUrl}/${profile._id}`).send(newSimulator).expect(400);

    expect(body).toMatchObject({ message: 'cryptocurrency must be a string' });
  });
});
