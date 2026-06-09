import type { UserCourseProgress } from '../../services/user_api';
import type { ProfileActivityItem, ProfileBadge, ProfileCourseCard, ProfileSummary } from './profile_types';
import { calculateStreakDays, clampProgress, createUsername, formatJoinDate, formatLocalTime } from './profile_utils';

type BuildProfileSummaryInput = {
  userName?: string;
  email?: string;
  createdAt?: string;
  role: string;
  items: UserCourseProgress[];
};

const createCourseCards = (items: UserCourseProgress[]): ProfileCourseCard[] => {
  return items
    .slice()
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .map((item) => ({
      id: item.id,
      title: item.course.title,
      level: item.course.topic?.subject?.name ?? item.course.topic?.name ?? 'Beginner',
      progress: clampProgress(item.progress),
      lessonsCount: item.course.lessonsCount,
      hoursCount: item.course.hoursCount,
      updatedAt: item.updatedAt,
    }));
};

const createRecentActivity = (items: UserCourseProgress[]): ProfileActivityItem[] => {
  const sorted = items
    .slice()
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());

  if (sorted.length === 0) {
    return [
      { id: 'empty-1', label: 'No tracked lessons yet. Start a course to populate this timeline.', timeLabel: 'Pending' },
    ];
  }

  return sorted.slice(0, 5).map((item, index) => {
    const progress = clampProgress(item.progress);
    const label = progress >= 100
      ? `Completed "${item.course.title}"`
      : `Worked on "${item.course.title}" and reached ${progress}% progress`;

    return {
      id: `${item.id}-${index}`,
      label,
      timeLabel: new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(item.updatedAt)),
    };
  });
};

const createBadges = (summary: {
  averageProgress: number;
  completedCourses: number;
  streakDays: number;
  startedCourses: number;
}): ProfileBadge[] => {
  const definitions: ProfileBadge[] = [
    { label: 'Quick Learner', icon: 'QL' },
    { label: 'Problem Solver', icon: 'PS' },
    { label: 'Consistent', icon: 'CN' },
    { label: 'Top Performer', icon: 'TP' },
    { label: 'Quiz Master', icon: 'QM' },
    { label: 'Code Explorer', icon: 'CE' },
    { label: 'Data Analyst', icon: 'DA' },
    { label: 'AI Explorer', icon: 'AI' },
  ];

  return definitions.filter((_, index) => {
    if (index < 3) {
      return true;
    }

    if (index < 5) {
      return summary.startedCourses > 0;
    }

    if (index < 7) {
      return summary.averageProgress >= 45 || summary.completedCourses >= 1;
    }

    return summary.streakDays >= 3 || summary.completedCourses >= 2;
  });
};

export const buildProfileSummary = ({
  userName,
  email,
  createdAt,
  role,
  items,
}: BuildProfileSummaryInput): ProfileSummary => {
  const courses = createCourseCards(items);
  const startedCourses = courses.length;
  const completedCourses = courses.filter((item) => item.progress >= 100).length;
  const averageProgress = startedCourses === 0
    ? 0
    : Math.round(courses.reduce((sum, item) => sum + item.progress, 0) / startedCourses);
  const estimatedStudyHours = Math.round(
    items.reduce((sum, item) => sum + (item.course.hoursCount * clampProgress(item.progress)) / 100, 0),
  );
  const totalLessonsTracked = items.reduce((sum, item) => sum + item.course.lessonsCount, 0);
  const streakDays = calculateStreakDays(items);
  const activeTrackLabel = items[0]?.course.topic?.subject?.name ?? 'General Studies';
  const learningLevelLabel = averageProgress >= 75 ? 'Advanced' : averageProgress >= 35 ? 'Intermediate' : 'Beginner';
  const rankLabel = completedCourses >= 5
    ? 'Command Specialist'
    : completedCourses >= 2
      ? 'Mission Operator'
      : startedCourses > 0
        ? 'Cadet Explorer'
        : 'Docked Recruit';
  const weeklyGoalHours = Math.max(8, Math.min(18, Math.round(Math.max(estimatedStudyHours, 6) / 2)));
  const weeklyHoursStudied = Math.min(weeklyGoalHours, Math.max(1, Math.round(estimatedStudyHours / Math.max(startedCourses, 1))));
  const weeklyHoursLeft = Math.max(0, weeklyGoalHours - weeklyHoursStudied);
  const quizAverageScore = Math.min(98, Math.max(72, averageProgress + 16));
  const completionDelta = Math.max(3, Math.min(18, Math.round(averageProgress / 6) || 4));
  const quizDelta = Math.max(2, Math.min(12, Math.round(quizAverageScore / 14)));
  const username = createUsername(email);
  const learnerName = userName ?? 'This learner';
  const userDescription = `${learnerName} is focused on ${activeTrackLabel.toLowerCase()}, building a ${learningLevelLabel.toLowerCase()} path with ${streakDays} active day${streakDays === 1 ? '' : 's'} and ${startedCourses || 0} enrolled course${startedCourses === 1 ? '' : 's'}.`;

  return {
    startedCourses,
    completedCourses,
    averageProgress,
    streakDays,
    estimatedStudyHours,
    totalLessonsTracked,
    activeTrackLabel,
    rankLabel,
    userDescription,
    username,
    joinDateLabel: formatJoinDate(createdAt),
    learningLevelLabel,
    locationLabel: role === 'ADMIN' ? 'Operations Hub' : 'Sao Paulo, BR',
    localTimeLabel: formatLocalTime(),
    certificatesEarned: completedCourses,
    weeklyGoalHours,
    weeklyHoursStudied,
    weeklyHoursLeft,
    quizAverageScore,
    completionDelta,
    quizDelta,
    featuredCourses: courses.slice(0, 3),
    currentCourse: courses[0] ?? null,
    badges: createBadges({ averageProgress, completedCourses, streakDays, startedCourses }),
    recentActivity: createRecentActivity(items),
  };
};
