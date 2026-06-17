import type { AuthUser } from '../../services/auth_api';
import type { UserCourseProgress } from '../../services/user_api';

export type ProfileCourseCard = {
  id: string;
  title: string;
  level: string;
  progress: number;
  lessonsCount: number;
  hoursCount: number;
  updatedAt: string;
};

export type ProfileBadge = {
  label: string;
  icon: string;
};

export type ProfileActivityItem = {
  id: string;
  label: string;
  timeLabel: string;
};

export type ProfileSummary = {
  startedCourses: number;
  completedCourses: number;
  averageProgress: number;
  streakDays: number;
  estimatedStudyHours: number;
  totalLessonsTracked: number;
  activeTrackLabel: string;
  rankLabel: string;
  userDescription: string;
  username: string;
  joinDateLabel: string;
  learningLevelLabel: string;
  locationLabel: string;
  localTimeLabel: string;
  certificatesEarned: number;
  weeklyGoalHours: number;
  weeklyHoursStudied: number;
  weeklyHoursLeft: number;
  quizAverageScore: number;
  completionDelta: number;
  quizDelta: number;
  featuredCourses: ProfileCourseCard[];
  currentCourse: ProfileCourseCard | null;
  badges: ProfileBadge[];
  recentActivity: ProfileActivityItem[];
};

export type ProfileHeroProps = {
  isAuthenticated: boolean;
  isLoading: boolean;
  onRequestLogin: () => void;
};

export type ProfileIdentityPanelProps = {
  summary: ProfileSummary;
  user: AuthUser;
  avatarError: string | null;
  isAvatarSaving: boolean;
  onAvatarChange: (file: File) => void;
};

export type ProfileOverviewProps = {
  bioDraft: string;
  bioError: string | null;
  isBioEditing: boolean;
  isBioSaving: boolean;
  onBioCancel: () => void;
  onBioDraftChange: (value: string) => void;
  onBioEdit: () => void;
  onBioSave: () => void;
  summary: ProfileSummary;
};

export type ProfileCourseProgressProps = {
  error: string | null;
  isLoading: boolean;
  items: UserCourseProgress[];
  summary: ProfileSummary;
};

export type ProfileStatsProps = {
  summary: ProfileSummary;
};

export type ProfileBadgesProps = {
  summary: ProfileSummary;
};

export type ProfileRecentActivityProps = {
  summary: ProfileSummary;
};
