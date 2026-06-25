import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, createApiAgent } from './api_test_client';
import { cleanupIntegrationUsers, disconnectPrisma, uniqueIntegrationEmail } from './db_test_utils';
import { ensureIntegrationTestEnv } from './test_env';

const validPassword = 'StrongPass!123';
const emailScope = 'auth';

const getSetCookies = (value: string | string[] | undefined): string[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

describe('auth integration', () => {
  beforeAll(async () => {
    ensureIntegrationTestEnv();
    await cleanupIntegrationUsers(emailScope);
  });

  afterAll(async () => {
    await cleanupIntegrationUsers(emailScope);
    await disconnectPrisma();
  });

  it('signs up a learner and starts a session without exposing passwordHash', async () => {
    const response = await api.post('/auth/signup').send({
      name: 'Integration Learner',
      email: uniqueIntegrationEmail(emailScope),
      password: validPassword,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: expect.objectContaining({
        email: expect.stringMatching(/^integration\+/),
        role: 'STUDENT',
      }),
      accessToken: expect.any(String),
    });
    expect(response.body.user.passwordHash).toBeUndefined();
    expect(getSetCookies(response.headers['set-cookie']).some((cookie) => {
      return cookie.startsWith('quantum_ed_refresh_token=');
    })).toBe(true);
  });

  it('rejects malformed signup email with a standard error payload', async () => {
    const response = await api.post('/auth/signup').send({
      name: 'Invalid Email',
      email: 'not-an-email',
      password: validPassword,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: expect.any(String) });
  });

  it('rejects weak signup password with a standard error payload', async () => {
    const response = await api.post('/auth/signup').send({
      name: 'Weak Password',
        email: uniqueIntegrationEmail(emailScope),
      password: 'weak',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: expect.any(String) });
  });

  it('signs in with valid credentials and rejects an invalid password', async () => {
    const email = uniqueIntegrationEmail(emailScope);

    await api.post('/auth/signup').send({
      name: 'Signin Learner',
      email,
      password: validPassword,
    });

    const validResponse = await api.post('/auth/signin').send({
      email,
      password: validPassword,
    });

    expect(validResponse.status).toBe(200);
    expect(validResponse.body.accessToken).toEqual(expect.any(String));
    expect(validResponse.body.user.passwordHash).toBeUndefined();

    const invalidResponse = await api.post('/auth/signin').send({
      email,
      password: 'WrongPass!123',
    });

    expect(invalidResponse.status).toBe(401);
    expect(invalidResponse.body).toEqual({ message: expect.any(String) });
  });

  it('refreshes a session with the refresh cookie and rejects refresh without a cookie', async () => {
    const agent = createApiAgent();

    await agent.post('/auth/signup').send({
      name: 'Refresh Learner',
      email: uniqueIntegrationEmail(emailScope),
      password: validPassword,
    }).expect(201);

    const refreshResponse = await agent.post('/auth/refresh').send();

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.accessToken).toEqual(expect.any(String));
    expect(refreshResponse.body.user.passwordHash).toBeUndefined();

    const missingCookieResponse = await api.post('/auth/refresh').send();

    expect(missingCookieResponse.status).toBe(401);
    expect(missingCookieResponse.body).toEqual({ message: expect.any(String) });
  });

  it('logs out and invalidates the refresh cookie session', async () => {
    const agent = createApiAgent();

    await agent.post('/auth/signup').send({
      name: 'Logout Learner',
      email: uniqueIntegrationEmail(emailScope),
      password: validPassword,
    }).expect(201);

    const logoutResponse = await agent.post('/auth/logout').send();

    expect(logoutResponse.status).toBe(204);
    expect(getSetCookies(logoutResponse.headers['set-cookie']).some((cookie) => {
      return cookie.startsWith('quantum_ed_refresh_token=') && cookie.includes('Expires=Thu, 01 Jan 1970');
    })).toBe(true);

    const refreshResponse = await agent.post('/auth/refresh').send();

    expect(refreshResponse.status).toBe(401);
    expect(refreshResponse.body).toEqual({ message: expect.any(String) });
  });
});
