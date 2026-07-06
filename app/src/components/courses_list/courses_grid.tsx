import Link from 'next/link';

import type { CourseListItem } from '../../services/course_api';
import { getCourseLevel, getCourseStatus, getCourseSubject } from './courses_data';
import '../../styles/courses_list_css/course-list-grid.css';

type CoursesGridProps = {
  courses: CourseListItem[];
  error: string | null;
  isLoading: boolean;
};

const loadingCards = Array.from({ length: 6 }, (_, index) => `loading-course-${index}`);

export default function CoursesGrid({ courses, error, isLoading }: CoursesGridProps) {
  if (isLoading) {
    return (
      <section className="courses-grid" aria-label="Loading courses" aria-live="polite">
        {loadingCards.map((card) => (
          <article className="courses-card courses-card--loading" key={card}>
            <span />
            <h2 />
            <p />
            <p />
            <div />
          </article>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="courses-grid courses-grid--empty" aria-live="polite">
        <article className="courses-empty-state">
          <h2>Could not load courses</h2>
          <p>{error}</p>
        </article>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="courses-grid courses-grid--empty" aria-live="polite">
        <article className="courses-empty-state">
          <h2>No courses found</h2>
          <p>Adjust the search term or select All Tracks to browse the full catalog.</p>
        </article>
      </section>
    );
  }

  return (
    <section className="courses-grid" aria-label="Available courses">
      {courses.map((course) => (
        <article className="courses-card" data-testid={`course-card-${course.slug}`} key={course.id}>
          <div className="courses-card__top">
            <span className="courses-card__subject">{getCourseSubject(course)}</span>
            <span className="courses-card__level">{getCourseLevel(course)}</span>
          </div>

          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <div className="courses-card__status">
            <span>{getCourseStatus(course)}</span>
          </div>

          <div className="courses-card__meta">
            <span>{course.lessonsCount} lessons</span>
            <span>{course.hoursCount}h</span>
          </div>

          <Link href={`/courses/${course.slug}`}>View course</Link>
        </article>
      ))}
    </section>
  );
}
