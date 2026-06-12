import { protectedRequest } from './http_client';
import type { CourseModuleSummary, CourseTopic } from './course_api';

export type LessonContent = {
  overview: string | null;
  videoUrl: string | null;
  body: string;
  resources: string[];
  exerciseCount: number;
  durationMinutes: number;
};

export type LessonViewerDetail = {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  content: LessonContent | null;
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
      modules: CourseModuleSummary[];
    };
  };
};

export function getLessonBySlugs(courseSlug: string, lessonSlug: string): Promise<LessonViewerDetail> {
  return protectedRequest<LessonViewerDetail>(`/courses/${courseSlug}/lessons/${lessonSlug}`);
}
