import { protectedRequest } from './http_client';
import type { CourseTopic } from './course_api';

export type LessonProgressRecord = {
  id: string;
  progress: number;
  completed: boolean;
  userId: string;
  lessonId: number;
  createdAt: string;
  updatedAt: string;
};

export type LessonContent = {
  overview: string | null;
  videoUrl: string | null;
  body: string;
  resources: string[];
  exerciseCount: number;
  durationMinutes: number;
};

export type LessonSidebarLesson = {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  lessonProgresses: LessonProgressRecord[];
};

export type LessonSidebarModule = {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  lessons: LessonSidebarLesson[];
};

export type LessonViewerDetail = {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  content: LessonContent | null;
  lessonProgresses: LessonProgressRecord[];
  module: {
    id: number;
    name: string;
    slug: string;
    order: number;
    course: {
      id: string;
      title: string;
      slug: string;
      description: string;
      topic: CourseTopic;
      progresses: Array<{
        id: string;
        progress: number;
      }>;
      modules: LessonSidebarModule[];
    };
  };
};

export type LessonProgressResponse = {
  lessonProgress: LessonProgressRecord;
  courseProgress: number;
};

export type UpdateLessonProgressPayload = {
  completed?: boolean;
  progress?: number;
};

export function getLessonBySlugs(courseSlug: string, lessonSlug: string): Promise<LessonViewerDetail> {
  return protectedRequest<LessonViewerDetail>(`/courses/${courseSlug}/lessons/${lessonSlug}`);
}

export function updateLessonProgress(
  courseSlug: string,
  lessonSlug: string,
  data: UpdateLessonProgressPayload,
): Promise<LessonProgressResponse> {
  return protectedRequest<LessonProgressResponse>(`/courses/${courseSlug}/lessons/${lessonSlug}/progress`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
