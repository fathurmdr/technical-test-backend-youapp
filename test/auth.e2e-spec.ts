import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAppTest } from './utils/run-app';
import { createTestUser, removeTestUser } from './utils/common';
import { Mongoose } from 'mongoose';
import mongoose from 'mongoose';

describe('POST /api/register', () => {
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

  afterEach(async () => {
    await removeTestUser();
  });

  it('should reject if email is empty', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: '',
        username: 'test',
        password: '12345678',
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toContain('email should not be empty');
    expect(response.body.error).toBe('Bad Request');
  });

  it('should reject if username is empty', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'test@email.com',
        username: '',
        password: '12345678',
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toContain('username should not be empty');
    expect(response.body.error).toBe('Bad Request');
  });

  it('should reject if password is lower than 8 characters', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'test@email.com',
        username: 'test',
        password: 'lower',
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toContain(
      'password must be longer than or equal to 8 characters',
    );
    expect(response.body.error).toBe('Bad Request');
  });

  it('should reject if email is already exist', async () => {
    let response = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'test@email.com',
        username: 'test',
        password: '12345678',
      });

    expect(response.status).toBe(201);

    response = await request(app.getHttpServer()).post('/api/register').send({
      email: 'test@email.com',
      username: 'test_diff',
      password: '12345678',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should reject if username is already exist', async () => {
    let response = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'test@email.com',
        username: 'test',
        password: '12345678',
      });

    expect(response.status).toBe(201);

    response = await request(app.getHttpServer()).post('/api/register').send({
      email: 'test_diff@email.com',
      username: 'test',
      password: '12345678',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should reject if username and email is already exist', async () => {
    let response = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'test@email.com',
        username: 'test',
        password: '12345678',
      });

    expect(response.status).toBe(201);

    response = await request(app.getHttpServer()).post('/api/register').send({
      email: 'test@email.com',
      username: 'test',
      password: '12345678',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should can register new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'test@email.com',
        username: 'test',
        password: '12345678',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User has been created successfully');
  });
});

describe('POST /api/login', () => {
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

  it('should reject if email or username is empty', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: '',
        username: '',
        password: '12345678',
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBe('Email or username is required');
  });

  it('should reject if password is lower than 8 characters', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'test@email.com',
        username: 'test',
        password: 'lower',
      });

    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toContain(
      'password must be longer than or equal to 8 characters',
    );
    expect(response.body.error).toBe('Bad Request');
  });

  it('should can login with correct password for the user test', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/login')
      .send({
        email: 'test@email.com',
        username: 'test',
        password: '12345678',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User has been logged in successfully');
    expect(response.body.access_token).toBeDefined();
  });
});
