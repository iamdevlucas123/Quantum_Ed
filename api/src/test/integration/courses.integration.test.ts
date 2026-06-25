import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, authHeader } from './api_test_client';
import {
  cleanupIntegrationUsers,
  disconnectPrisma,
  findIntegrationCourse,
  INTEGRATION_COURSE_SLUG,
  uniqueIntegrationEmail,
} from './db_test_utils';
import { ensureIntegrationTestEnv } from './test_env';

const validPassword = 'StrongPass!123';
const emailScope = 'courses';

describe('courses integration', () => {
  beforeAll(async () => {
    ensureIntegrationTestEnv();
    await cleanupIntegrationUsers(emailScope);
  });

  afterAll(async () => {
    await cleanupIntegrationUsers(emailScope);
    await disconnectPrisma();
  });

  it('returns public courses without a bearer token', async () => {
    const response = await api.get('/courses');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        slug: INTEGRATION_COURSE_SLUG,
        title: 'Integration Test Course',
      }),
    ]));
  });

  it('returns the public course detail by slug without a bearer token', async () => {
    const response = await api.get(`/courses/${INTEGRATION_COURSE_SLUG}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      slug: INTEGRATION_COURSE_SLUG,
      modules: expect.arrayContaining([
        expect.objectContaining({
          slug: 'integration-test-module',
          lessons: expect.arrayContaining([
            expect.objectContaining({ slug: 'integration-test-lesson' }),
            expect.objectContaining({ slug: 'integration-next-lesson' }),
          ]),
        }),
      ]),
    }));
  });

  it('returns protected course detail with a bearer token', async () => {
    const signupResponse = await api.post('/auth/signup').send({
      name: 'Course Detail Learner',
      email: uniqueIntegrationEmail(emailScope),
      password: validPassword,
    });

    const response = await api
      .get(`/courses/${INTEGRATION_COURSE_SLUG}/detail`)
      .set('Authorization', authHeader(signupResponse.body.accessToken));

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      slug: INTEGRATION_COURSE_SLUG,
      saved: false,
      modules: expect.arrayContaining([
        expect.objectContaining({
          lessons: expect.arrayContaining([
            expect.objectContaining({
              slug: 'integration-test-lesson',
              lessonProgresses: [],
            }),
          ]),
        }),
      ]),
    }));
  });

  it('rejects protected course detail without a bearer token', async () => {
    const response = await api.get(`/courses/${INTEGRATION_COURSE_SLUG}/detail`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token not provided' });
  });

  it('has the imported integration course in the database', async () => {
    const course = await findIntegrationCourse();

    expect(course).toEqual(expect.objectContaining({
      slug: INTEGRATION_COURSE_SLUG,
      lessonsCount: 2,
      hoursCount: 1,
    }));
    expect(course?.modules[0]?.lessons).toHaveLength(2);
  });
});
