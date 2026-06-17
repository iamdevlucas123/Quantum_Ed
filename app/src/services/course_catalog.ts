import { getCourseLevel, getCourseSubject } from '../components/courses_list/courses_data';
import { getCourses, type CourseListItem } from './course_api';

export type HomeCourseCard = {
  title: string;
  slug: string;
  description: string;
  badge: string;
  lessonsLabel: string;
  durationLabel: string;
};

export type HomeCourseSubjectGroup = {
  subjectName: string;
  courses: HomeCourseCard[];
};

const formatLessonsLabel = (lessonsCount: number): string => {
  if (lessonsCount === 1) {
    return '1 lesson';
  }

  return `${lessonsCount} lessons`;
};

const formatDurationLabel = (hoursCount: number): string => {
  if (hoursCount === 1) {
    return '1 hour';
  }

  return `${hoursCount} hours`;
};

const mapCourseToHomeCard = (course: CourseListItem): HomeCourseCard => ({
  title: course.title,
  slug: course.slug,
  description: course.description,
  badge: getCourseLevel(course),
  lessonsLabel: formatLessonsLabel(course.lessonsCount),
  durationLabel: formatDurationLabel(course.hoursCount),
});

export const mapCoursesToHomeSubjectGroups = (courses: CourseListItem[]): HomeCourseSubjectGroup[] => {
  const groups = new Map<string, HomeCourseCard[]>();

  courses.forEach((course) => {
    const subjectName = getCourseSubject(course);
    const currentCourses = groups.get(subjectName) ?? [];
    currentCourses.push(mapCourseToHomeCard(course));
    groups.set(subjectName, currentCourses);
  });

  return [...groups.entries()]
    .map(([subjectName, groupedCourses]) => ({
      subjectName,
      courses: groupedCourses.sort((left, right) => left.title.localeCompare(right.title)),
    }))
    .sort((left, right) => left.subjectName.localeCompare(right.subjectName));
};

export const getHomeCourseCatalog = async (): Promise<HomeCourseSubjectGroup[]> => {
  const courses = await getCourses();
  return mapCoursesToHomeSubjectGroups(courses);
};
