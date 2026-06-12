import { Link } from 'react-router-dom';

import type { CourseModuleSummary } from '../../services/course_api';

type SideBarProps = {
  courseSlug: string;
  courseTitle: string;
  currentLessonSlug: string;
  modules: CourseModuleSummary[];
};

export default function SideBar({ courseSlug, courseTitle, currentLessonSlug, modules }: SideBarProps) {
  return (
    <aside className="lesson-sidebar">
      <div className="lesson-sidebar__header">
        <div>
          <p className="lesson-sidebar__eyebrow">Course</p>
          <h2>{courseTitle}</h2>
        </div>
      </div>

      <label className="lesson-sidebar__search">
        <input type="text" placeholder="Search content" />
      </label>

      <div className="lesson-sidebar__chips">
        <button type="button" className="lesson-sidebar__chip is-active">All Lessons</button>
        <button type="button" className="lesson-sidebar__chip">{modules.length} Modules</button>
      </div>

      <div className="lesson-sidebar__sections">
        {modules.map((module) => (
          <section className="lesson-sidebar__section" key={module.id}>
            <div className="lesson-sidebar__section-header">
              <strong>{module.name}</strong>
              <span>{module.lessons.length} lessons</span>
            </div>

            <div className="lesson-sidebar__section-links">
              {module.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  className={lesson.slug === currentLessonSlug ? 'is-active' : undefined}
                  to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                >
                  <strong>{lesson.name}</strong>
                  <span>{lesson.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
