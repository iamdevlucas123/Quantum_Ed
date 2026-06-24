import { useEffect, useMemo, useState } from 'react';

import Header from '../components/header';
import GithubFooter from '../components/github_footer';
import CoursesFilters from '../components/courses_list/courses_filters';
import CoursesGrid from '../components/courses_list/courses_grid';
import { ALL_TRACKS, filterCourses, getCourseSubjects } from '../components/courses_list/course_filters';
import { getCourses, type CourseListItem } from '../services/course_api';
import '../styles/courses_list_css/course-list-hero.css';

export default function Courses() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubject, setActiveSubject] = useState(ALL_TRACKS);

  useEffect(() => {
    let isMounted = true;

    getCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data);
        }
      })
      .catch((currentError) => {
        if (isMounted) {
          const message = currentError instanceof Error ? currentError.message : 'Could not load the course catalog';
          setError(message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const subjects = useMemo(() => {
    return getCourseSubjects(courses);
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return filterCourses(courses, activeSubject, searchTerm);
  }, [activeSubject, courses, searchTerm]);

  return (
    <>
      <div className="courses-route">
        <Header />
        <main className="courses-page">
          <CoursesFilters
            activeSubject={activeSubject}
            allCoursesCount={courses.length}
            isLoading={isLoading}
            onSearchChange={setSearchTerm}
            onSubjectChange={setActiveSubject}
            searchTerm={searchTerm}
            subjects={subjects}
            totalCourses={filteredCourses.length}
          />
          <CoursesGrid courses={filteredCourses} error={error} isLoading={isLoading} />
        </main>
      </div>
      <GithubFooter />
    </>
  );
}
