import { INestApplication } from '@nestjs/common';
import { createAppTest } from './utils/run-app';
import * as request from 'supertest';
import { createTestUser, getToken, removeTestUser } from './utils/common';
import { Mongoose } from 'mongoose';
import mongoose from 'mongoose';

describe('GET /api/getProfile', () => {
  let app: INestApplication;
  let connectionDB: Mongoose;

  beforeAll(async () => {
    connectionDB = await mongoose.connect(process.env.MONGO_URI);
    app = await createAppTest();
  });

  afterAll(async () => {
    await app.close();
    await connectionDB.disconnect();
  });

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should reject if token not provided', async () => {
    const response = await request(app.getHttpServer()).get('/api/getProfile');

    expect(response.status).toBe(401);
    expect(response.body.auth).toBe(false);
    expect(response.body.message).toBe('No token provided.');
  });

  it('should can get profile with token', async () => {
    const token = await getToken(app.getHttpServer());
    const response = await request(app.getHttpServer())
      .get('/api/getProfile')
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profile has been found successfully');
    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toBeDefined();
    expect(response.body.data.username).toBeDefined();
    expect(response.body.data.email).toBeDefined();
  });
});

describe('PUT /api/updateProfile', () => {
  let app: INestApplication;
  let connectionDB: Mongoose;

  beforeAll(async () => {
    connectionDB = await mongoose.connect(process.env.MONGO_URI);
    app = await createAppTest();
  });

  afterAll(async () => {
    await app.close();
    await connectionDB.disconnect();
  });

  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it('should reject if token not provided', async () => {
    const response = await request(app.getHttpServer())
      .put('/api/updateProfile')
      .send({
        name: 'test',
        birthday: '1999-02-30',
        height: 170,
        weight: 60,
        interests: ['coding'],
      });

    expect(response.status).toBe(401);
    expect(response.body.auth).toBe(false);
    expect(response.body.message).toBe('No token provided.');
  });

  it('should can update profile with token', async () => {
    const token = await getToken(app.getHttpServer());
    const response = await request(app.getHttpServer())
      .put('/api/updateProfile')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'test',
        birthday: '1999-02-30',
        height: 170,
        weight: 60,
        interests: ['coding'],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Profile has been updated successfully');
    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toBeDefined();
    expect(response.body.data.username).toBeDefined();
    expect(response.body.data.name).toBe('test');
    expect(response.body.data.birthday).toBe('1999-02-30');
    expect(response.body.data.horoscope).toBeDefined();
    expect(response.body.data.zodiac).toBeDefined();
    expect(response.body.data.height).toBe(170);
    expect(response.body.data.weight).toBe(60);
    expect(response.body.data.interests).toContain('coding');
  });
});
