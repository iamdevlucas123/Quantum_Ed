import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, authHeader } from './api_test_client';
import {
  cleanupIntegrationUsers,
  disconnectPrisma,
  INTEGRATION_COURSE_SLUG,
  INTEGRATION_LESSON_SLUG,
  uniqueIntegrationEmail,
} from './db_test_utils';
import { ensureIntegrationTestEnv } from './test_env';

const validPassword = 'StrongPass!123';
const emailScope = 'progress';

describe('lesson progress integration', () => {
  beforeAll(async () => {
    ensureIntegrationTestEnv();
    await cleanupIntegrationUsers(emailScope);
  });

  afterAll(async () => {
    await cleanupIntegrationUsers(emailScope);
    await disconnectPrisma();
  });

  it('requires a bearer token to update lesson progress', async () => {
    const response = await api
      .put(`/courses/${INTEGRATION_COURSE_SLUG}/lessons/${INTEGRATION_LESSON_SLUG}/progress`)
      .send({
        progress: 100,
        completed: true,
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token not provided' });
  });

  it('creates lesson progress and reflects it in course detail and user progress', async () => {
    const signupResponse = await api.post('/auth/signup').send({
      name: 'Progress Learner',
      email: uniqueIntegrationEmail(emailScope),
      password: validPassword,
    });
    const accessToken = signupResponse.body.accessToken as string;
    const userId = signupResponse.body.user.id as string;

    const updateResponse = await api
      .put(`/courses/${INTEGRATION_COURSE_SLUG}/lessons/${INTEGRATION_LESSON_SLUG}/progress`)
      .set('Authorization', authHeader(accessToken))
      .send({
        progress: 100,
        completed: true,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual(expect.objectContaining({
      lessonProgress: expect.objectContaining({
        progress: 100,
        completed: true,
      }),
      courseProgress: 50,
    }));

    const detailResponse = await api
      .get(`/courses/${INTEGRATION_COURSE_SLUG}/detail`)
      .set('Authorization', authHeader(accessToken));

    const firstLesson = detailResponse.body.modules[0].lessons.find((lesson: { slug: string }) => {
      return lesson.slug === INTEGRATION_LESSON_SLUG;
    });

    expect(detailResponse.status).toBe(200);
    expect(firstLesson.lessonProgresses).toEqual([
      expect.objectContaining({
        progress: 100,
        completed: true,
      }),
    ]);

    const userProgressResponse = await api
      .get(`/users/${userId}/progress`)
      .set('Authorization', authHeader(accessToken));

    expect(userProgressResponse.status).toBe(200);
    expect(userProgressResponse.body).toEqual([
      expect.objectContaining({
        progress: 50,
        course: expect.objectContaining({
          slug: INTEGRATION_COURSE_SLUG,
        }),
      }),
    ]);
  });
});
