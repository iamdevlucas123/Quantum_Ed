import type { CourseListItem } from '../../services/course_api';

export const getCourseLevel = (course: Pick<CourseListItem, 'hoursCount' | 'lessonsCount'>): 'Beginner' | 'Intermediate' | 'Advanced' => {
  if (course.hoursCount >= 14 || course.lessonsCount >= 18) {
    return 'Advanced';
  }

  if (course.hoursCount >= 8 || course.lessonsCount >= 10) {
    return 'Intermediate';
  }

  return 'Beginner';
};

export const getCourseStatus = (course: Pick<CourseListItem, 'topic'>): string => {
  const subject = course.topic?.subject?.name?.toLowerCase() ?? '';
  const topic = course.topic?.name?.toLowerCase() ?? '';

  if (subject.includes('ai') || topic.includes('ai') || topic.includes('llm')) {
    return 'AI Systems Track';
  }

  if (topic.includes('prompt') || topic.includes('rag')) {
    return 'Applied Agent Track';
  }

  if (subject.includes('software')) {
    return 'Production Systems';
  }

  return 'Core Engineer Track';
};

export const getCourseSubject = (course: Pick<CourseListItem, 'topic'>): string => {
  return course.topic?.subject?.name ?? course.topic?.name ?? 'AI Engineering';
};
