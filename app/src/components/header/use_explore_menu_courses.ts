import { useEffect, useMemo, useState } from 'react';

import { getCourses, type CourseListItem } from '../../services/course_api';

export type ExploreMenuCourse = {
  title: string;
  slug: string;
};

export type ExploreMenuSubject = {
  subjectName: string;
  courses: ExploreMenuCourse[];
};

const getSubjectName = (course: CourseListItem): string => {
  const subjectName = course.topic.subject?.name;

  if (subjectName && subjectName.trim()) {
    return subjectName;
  }

  if (course.topic.name.trim()) {
    return course.topic.name;
  }

  return 'General';
};

export function useExploreMenuCourses() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async (): Promise<void> => {
      try {
        const catalog = await getCourses();

        if (!isMounted) {
          return;
        }

        setCourses(catalog);
      } catch {
        if (!isMounted) {
          return;
        }

        setCourses([]);
      }
    };

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const subjects = useMemo<ExploreMenuSubject[]>(() => {
    const groupedCourses = new Map<string, ExploreMenuCourse[]>();

    courses.forEach((course) => {
      const subjectName = getSubjectName(course);
      const subjectCourses = groupedCourses.get(subjectName) ?? [];

      subjectCourses.push({
        title: course.title,
        slug: course.slug,
      });

      groupedCourses.set(subjectName, subjectCourses);
    });

    return Array.from(groupedCourses.entries())
      .map(([subjectName, subjectCourses]) => ({
        subjectName,
        courses: subjectCourses.sort((leftCourse, rightCourse) => leftCourse.title.localeCompare(rightCourse.title)),
      }))
      .sort((leftSubject, rightSubject) => leftSubject.subjectName.localeCompare(rightSubject.subjectName));
  }, [courses]);

  return {
    subjects,
  };
}
