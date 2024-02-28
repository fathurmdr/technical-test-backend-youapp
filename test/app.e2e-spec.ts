import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAppTest } from './utils/run-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createAppTest();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });
});
