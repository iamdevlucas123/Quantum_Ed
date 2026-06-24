import type { CourseListItem } from '../../services/course_api';
import { getCourseSubject } from './courses_data';

export const ALL_TRACKS = 'All Tracks';

export const getCourseSubjects = (courses: CourseListItem[]): string[] => {
  const uniqueSubjects = [...new Set(courses.map((course) => getCourseSubject(course)))];
  return [ALL_TRACKS, ...uniqueSubjects];
};

export const filterCourses = (
  courses: CourseListItem[],
  activeSubject: string,
  searchTerm: string,
): CourseListItem[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesSubject = activeSubject === ALL_TRACKS || getCourseSubject(course) === activeSubject;
    const searchableContent = [
      course.title,
      course.description,
      course.topic?.name,
      course.topic?.subject?.name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = normalizedSearch.length === 0 || searchableContent.includes(normalizedSearch);

    return matchesSubject && matchesSearch;
  });
};
