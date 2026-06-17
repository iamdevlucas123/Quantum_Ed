import { protectedRequest } from './http_client';

export type CourseLessonProgress = {
  id: string;
  progress: number;
  completed: boolean;
  userId: string;
  lessonId: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseLessonSummary = {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  lessonProgresses?: CourseLessonProgress[];
};

export type CourseModuleSummary = {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  lessons: CourseLessonSummary[];
};

export type CourseTopic = {
  name: string;
  subject?: {
    name: string;
  };
};

export type CourseDetail = {
  id: string;
  title: string;
  slug: string;
  stars: number;
  description: string;
  lessonsCount: number;
  hoursCount: number;
  priorKnowledge: string[];
  learnObjectives: string[];
  saved?: boolean;
  topic: CourseTopic;
  modules: CourseModuleSummary[];
};

export type CourseListItem = Omit<CourseDetail, 'modules' | 'priorKnowledge' | 'learnObjectives'>;

export function getCourses(): Promise<CourseListItem[]> {
  return protectedRequest<CourseListItem[]>('/courses');
}

export function getCourseBySlug(slug: string): Promise<CourseDetail> {
  return protectedRequest<CourseDetail>(`/courses/${slug}/detail`);
}

export type CourseSaveState = {
  saved: boolean;
};

export function saveCourse(slug: string): Promise<CourseSaveState> {
  return protectedRequest<CourseSaveState>(`/courses/${slug}/save`, {
    method: 'PUT',
  });
}

export function unsaveCourse(slug: string): Promise<CourseSaveState> {
  return protectedRequest<CourseSaveState>(`/courses/${slug}/save`, {
    method: 'DELETE',
  });
}
