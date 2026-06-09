import type { ProfileCourseProgressProps } from './profile_types';

export default function ProfileCourseProgress({
  error,
  isLoading,
  items,
  summary,
}: ProfileCourseProgressProps) {
  return (
    <section className="profile-card profile-card--courses" id="profile-courses">
      <div className="profile-card__header profile-card__header--split">
        <h2>Your Courses</h2>
        <a href="/courses">View all courses</a>
      </div>

      {error ? <p className="profile-message profile-message--error">{error}</p> : null}

      {!isLoading && items.length === 0 ? (
        <div className="profile-message">
          <h3>No courses tracked yet</h3>
          <p>Start a course to populate your progress dashboard and study activity timeline.</p>
          <a href="/courses">Browse courses</a>
        </div>
      ) : null}

      {summary.featuredCourses.length > 0 ? (
        <div className="profile-courses-grid">
          {summary.featuredCourses.map((course) => (
            <article className="profile-course-card" key={course.id}>
              <h3>{course.title}</h3>
              <p>{course.level}</p>
              <div className="profile-course-card__progress" aria-hidden="true">
                <span style={{ width: `${course.progress}%` }} />
              </div>
              <div className="profile-course-card__footer">
                <strong>{course.progress}%</strong>
                <button type="button">Continue</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {summary.currentCourse ? (
        <article className="profile-current-course">
          <div className="profile-current-course__media" aria-hidden="true">
            <img alt="" src="/assets/backgrounds/planet-indigo-shadow.png" />
          </div>
          <div className="profile-current-course__body">
            <div className="profile-current-course__top">
              <span>Current Course</span>
              <small>In Progress</small>
            </div>
            <h3>{summary.currentCourse.title}</h3>
            <div className="profile-current-course__progress">
              <span style={{ width: `${summary.currentCourse.progress}%` }} />
            </div>
            <div className="profile-current-course__meta">
              <span>
                {Math.max(1, Math.round((summary.currentCourse.lessonsCount * summary.currentCourse.progress) / 100))} /{' '}
                {summary.currentCourse.lessonsCount} modules completed
              </span>
              <strong>{summary.currentCourse.progress}%</strong>
            </div>
          </div>
          <div className="profile-current-course__action">
            <button type="button">Continue Learning</button>
          </div>
        </article>
      ) : null}
    </section>
  );
}
