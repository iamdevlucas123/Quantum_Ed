import type { UserCourseProgress } from '../../services/user_api';

export const clampProgress = (value: number): number => {
  return Math.min(100, Math.max(0, Math.round(value)));
};

const createCalendarDays = (items: UserCourseProgress[]): string[] => {
  return [...new Set(items.map((item) => item.updatedAt.slice(0, 10)))].sort().reverse();
};

export const calculateStreakDays = (items: UserCourseProgress[]): number => {
  const days = createCalendarDays(items);

  if (days.length === 0) {
    return 0;
  }

  let streak = 1;
  let current = new Date(`${days[0]}T00:00:00`);

  for (let index = 1; index < days.length; index += 1) {
    const next = new Date(`${days[index]}T00:00:00`);
    const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

    if (diff !== 1) {
      break;
    }

    streak += 1;
    current = next;
  }

  return streak;
};

export const formatJoinDate = (value?: string): string => {
  if (!value) {
    return 'Recently joined';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export const formatLocalTime = (): string => {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
};

export const createUsername = (email?: string): string => {
  if (!email) {
    return 'learner';
  }

  return email.split('@')[0].replace(/[^a-z0-9._-]/gi, '').toLowerCase();
};
