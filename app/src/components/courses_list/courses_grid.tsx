import { Link } from 'react-router-dom';

import type { CourseListItem } from '../../services/course_api';
import { getCourseLevel, getCourseStatus, getCourseSubject } from './courses_data';
import '../../styles/courses_list_css/course-list-grid.css';

type CoursesGridProps = {
  courses: CourseListItem[];
  error: string | null;
  isLoading: boolean;
};

export default function CoursesGrid({ courses, error, isLoading }: CoursesGridProps) {
  if (isLoading) {
    return (
      <section className="courses-grid courses-grid--empty" aria-live="polite">
        <article className="courses-empty-state">
          <h2>Loading catalog</h2>
          <p>Syncing the current AI engineering tracks from the platform.</p>
        </article>
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
          <p>Try another search or filter to find the next course in the AI engineer path.</p>
        </article>
      </section>
    );
  }

  return (
    <section className="courses-grid" aria-label="Available courses">
      {courses.map((course) => (
        <article className="courses-card" key={course.id}>
          <div className="courses-card__top">
            <span className="courses-card__subject">{getCourseSubject(course)}</span>
            <span className="courses-card__level">{getCourseLevel(course)}</span>
          </div>

          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <div className="courses-card__status">
            <img src="/assets/sprites/laser-projectile-effects.png" alt="" />
            <span>{getCourseStatus(course)}</span>
          </div>

          <div className="courses-card__meta">
            <span>{course.lessonsCount} lessons</span>
            <span>{course.hoursCount}h</span>
          </div>

          <Link to={`/courses/${course.slug}`}>View course</Link>
        </article>
      ))}
    </section>
  );
}
