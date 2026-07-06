import Link from 'next/link';

import type { CourseDetail } from '../../services/course_api';

type CourseMetaProps = {
  course: CourseDetail;
  firstLessonHref: string | null;
};

export default function CourseMeta({ course, firstLessonHref }: CourseMetaProps) {
  return (
    <div className="course-meta">
      <div className="course-meta__items">
        <span className="course-rating">
          <i aria-hidden="true">*</i>
          <strong>{course.stars.toFixed(1)} rating</strong>
        </span>
        <span>
          <i aria-hidden="true">[]</i>
          <strong>{course.lessonsCount} lessons</strong>
        </span>
        <span>
          <i aria-hidden="true">::</i>
          <strong>{course.modules.length} modules</strong>
        </span>
        <span>
          <i aria-hidden="true">+</i>
          <strong>{course.topic?.subject?.name ?? 'AI Engineering'}</strong>
        </span>
        <span>
          <i aria-hidden="true">~</i>
          <strong>{course.hoursCount}h</strong>
        </span>
      </div>

      <div className="course-actions">
        {firstLessonHref ? (
          <Link href={firstLessonHref}>Start Learning</Link>
        ) : (
          <button type="button">Start Learning</button>
        )}
        <a href="#course-roadmap">Course Content</a>
      </div>
    </div>
  );
}
