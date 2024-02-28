import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createAppTest } from './utils/run-app';

describe('POST /api/register', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createAppTest();
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

  it('should reject if username or email is already exist', async () => {
    const responseExistEmail = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'user_exist@email.com',
        username: 'user_exist123',
        password: '12345678',
      });

    expect(responseExistEmail.status).toBe(400);
    expect(responseExistEmail.body.message).toBe('User already exists');

    const responseExistUsername = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'user_exist123@email.com',
        username: 'user_exist',
        password: '12345678',
      });

    expect(responseExistUsername.status).toBe(400);
    expect(responseExistUsername.body.message).toBe('User already exists');

    const responseExistBoth = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'user_exist@email.com',
        username: 'user_exist',
        password: '12345678',
      });

    expect(responseExistBoth.status).toBe(400);
    expect(responseExistBoth.body.message).toBe('User already exists');
  }, 100000);

  it('should can register new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/register')
      .send({
        email: 'new_user@email.com',
        username: 'new_user',
        password: '12345678',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User has been created successfully');
  });
});

describe('POST /api/login', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createAppTest();
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
