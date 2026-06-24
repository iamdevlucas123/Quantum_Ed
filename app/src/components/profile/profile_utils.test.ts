import { describe, expect, it, vi } from 'vitest';

import type { UserCourseProgress } from '../../services/user_api';
import { calculateStreakDays, clampProgress, createUsername, formatJoinDate, formatLocalTime } from './profile_utils';

const createProgress = (updatedAt: string): UserCourseProgress => ({
  id: updatedAt,
  progress: 50,
  userId: 'user-1',
  courseId: 'course-1',
  createdAt: updatedAt,
  updatedAt,
  course: {
    id: 'course-1',
    title: 'Course',
    slug: 'course',
    stars: 5,
    description: 'Course',
    lessonsCount: 5,
    hoursCount: 4,
  },
});

describe('profile utils', () => {
  it('clamps and rounds progress values', () => {
    expect(clampProgress(-10)).toBe(0);
    expect(clampProgress(120)).toBe(100);
    expect(clampProgress(42.6)).toBe(43);
  });

  it('calculates empty and consecutive streaks', () => {
    expect(calculateStreakDays([])).toBe(0);
    expect(calculateStreakDays([
      createProgress('2026-06-24T10:00:00.000Z'),
      createProgress('2026-06-23T10:00:00.000Z'),
      createProgress('2026-06-22T10:00:00.000Z'),
    ])).toBe(3);
  });

  it('stops streak calculation at the first gap', () => {
    expect(calculateStreakDays([
      createProgress('2026-06-24T10:00:00.000Z'),
      createProgress('2026-06-22T10:00:00.000Z'),
      createProgress('2026-06-21T10:00:00.000Z'),
    ])).toBe(1);
  });

  it('formats join dates and usernames', () => {
    expect(formatJoinDate()).toBe('Recently joined');
    expect(createUsername()).toBe('learner');
    expect(createUsername('Ada+Test.User@example.com')).toBe('adatest.user');
  });

  it('formats local time with fake timers', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-24T12:30:00.000Z'));

    expect(formatLocalTime()).toMatch(/\d/);

    vi.useRealTimers();
  });
});
