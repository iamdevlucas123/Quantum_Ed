import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, authHeader } from './api_test_client';
import { cleanupIntegrationUsers, disconnectPrisma, uniqueIntegrationEmail } from './db_test_utils';
import { ensureIntegrationTestEnv } from './test_env';

const validPassword = 'StrongPass!123';
const tinyPngDataUrl = 'data:image/png;base64,iVBORw0KGgo=';
const emailScope = 'profile';

describe('profile integration', () => {
  beforeAll(async () => {
    ensureIntegrationTestEnv();
    await cleanupIntegrationUsers(emailScope);
  });

  afterAll(async () => {
    await cleanupIntegrationUsers(emailScope);
    await disconnectPrisma();
  });

  it('updates the current user profile with a valid bearer token', async () => {
    const signupResponse = await api.post('/auth/signup').send({
      name: 'Profile Learner',
      email: uniqueIntegrationEmail(emailScope),
      password: validPassword,
    });

    const response = await api
      .patch('/users/me/profile')
      .set('Authorization', authHeader(signupResponse.body.accessToken))
      .send({
        bio: 'Integration test bio',
        avatarUrl: tinyPngDataUrl,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      bio: 'Integration test bio',
      avatarUrl: tinyPngDataUrl,
    }));
    expect(response.body.passwordHash).toBeUndefined();
  });

  it('requires a bearer token to update profile', async () => {
    const response = await api.patch('/users/me/profile').send({
      bio: 'Unauthorized bio',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token not provided' });
  });

  it('rejects an invalid avatar URL with a standard error payload', async () => {
    const signupResponse = await api.post('/auth/signup').send({
      name: 'Invalid Avatar Learner',
      email: uniqueIntegrationEmail(emailScope),
      password: validPassword,
    });

    const response = await api
      .patch('/users/me/profile')
      .set('Authorization', authHeader(signupResponse.body.accessToken))
      .send({
        avatarUrl: 'https://example.com/avatar.png',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'avatarUrl must be an image data URL' });
  });
});
