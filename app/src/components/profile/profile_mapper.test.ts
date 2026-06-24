import { describe, expect, it, vi } from 'vitest';

import type { UserCourseProgress } from '../../services/user_api';
import { buildProfileSummary } from './profile_mapper';

vi.mock('./profile_utils', async (importOriginal) => {
  const original = await importOriginal<typeof import('./profile_utils')>();

  return {
    ...original,
    formatLocalTime: () => '9:30 AM',
  };
});

const createProgress = (overrides: Partial<UserCourseProgress>): UserCourseProgress => ({
  id: overrides.id ?? 'progress-1',
  progress: overrides.progress ?? 50,
  userId: 'user-1',
  courseId: overrides.courseId ?? 'course-1',
  createdAt: overrides.createdAt ?? '2026-06-20T10:00:00.000Z',
  updatedAt: overrides.updatedAt ?? '2026-06-20T10:00:00.000Z',
  course: {
    id: overrides.course?.id ?? 'course-1',
    title: overrides.course?.title ?? 'Prompt Engineering',
    slug: overrides.course?.slug ?? 'prompt-engineering',
    stars: overrides.course?.stars ?? 5,
    description: overrides.course?.description ?? 'Prompting',
    lessonsCount: overrides.course?.lessonsCount ?? 10,
    hoursCount: overrides.course?.hoursCount ?? 8,
    topic: overrides.course?.topic ?? {
      name: 'Prompting',
      subject: {
        name: 'AI Engineering',
      },
    },
  },
});

describe('profile mapper', () => {
  it('builds an empty summary with fallback activity', () => {
    const summary = buildProfileSummary({
      role: 'STUDENT',
      items: [],
    });

    expect(summary.startedCourses).toBe(0);
    expect(summary.featuredCourses).toEqual([]);
    expect(summary.currentCourse).toBeNull();
    expect(summary.recentActivity[0].id).toBe('empty-1');
  });

  it('calculates course stats and selects recent courses', () => {
    const summary = buildProfileSummary({
      userName: 'Ada',
      email: 'ada@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
      role: 'STUDENT',
      bio: 'Building AI systems.',
      items: [
        createProgress({
          id: 'older',
          progress: 100,
          updatedAt: '2026-06-21T10:00:00.000Z',
          course: {
            id: 'course-1',
            title: 'Linear Algebra',
            slug: 'linear-algebra',
            stars: 5,
            description: 'Math',
            lessonsCount: 8,
            hoursCount: 6,
            topic: { name: 'Math Foundations', subject: { name: 'Mathematics' } },
          },
        }),
        createProgress({
          id: 'newer',
          progress: 50,
          updatedAt: '2026-06-24T10:00:00.000Z',
          course: {
            id: 'course-2',
            title: 'RAG Systems',
            slug: 'rag-systems',
            stars: 5,
            description: 'RAG',
            lessonsCount: 12,
            hoursCount: 10,
            topic: { name: 'RAG', subject: { name: 'AI Engineering' } },
          },
        }),
      ],
    });

    expect(summary.startedCourses).toBe(2);
    expect(summary.completedCourses).toBe(1);
    expect(summary.averageProgress).toBe(75);
    expect(summary.estimatedStudyHours).toBe(11);
    expect(summary.currentCourse?.id).toBe('newer');
    expect(summary.featuredCourses).toHaveLength(2);
    expect(summary.userDescription).toBe('Building AI systems.');
    expect(summary.activeTrackLabel).toBe('Mathematics');
    expect(summary.learningLevelLabel).toBe('Advanced');
    expect(summary.badges.length).toBeGreaterThan(3);
  });

  it('creates a fallback description when bio is empty', () => {
    const summary = buildProfileSummary({
      userName: 'Ada',
      email: 'ada@example.com',
      role: 'ADMIN',
      bio: '  ',
      items: [createProgress({ progress: 25 })],
    });

    expect(summary.userDescription).toContain('Ada is focused on ai engineering');
    expect(summary.locationLabel).toBe('Operations Hub');
    expect(summary.learningLevelLabel).toBe('Beginner');
  });
});
