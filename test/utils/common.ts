import * as request from 'supertest';
import { App } from 'supertest/types';
import { profileModel, userModel } from './models';
import { hash } from 'bcrypt';

export async function createTestUser() {
  await userModel.create({
    email: 'test@email.com',
    username: 'test',
    password: await hash('12345678', 10),
  });
}

export async function removeTestUser() {
  const user = await userModel.findOneAndDelete({
    email: 'test@email.com',
  });

  if (user) {
    await profileModel.deleteOne({ user: user.id });
  }
}

export async function getToken(
  appServer: App,
  payload: object = {
    email: 'test@email.com',
    username: 'test',
    password: '12345678',
  },
) {
  const loginResponse = await request(appServer)
    .post('/api/login')
    .send(payload);

  return loginResponse.body.access_token;
}
