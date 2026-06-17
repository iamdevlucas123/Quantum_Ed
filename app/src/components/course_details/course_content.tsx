import { Link } from 'react-router-dom';

import type { CourseModuleSummary } from '../../services/course_api';

type CourseContentProps = {
  courseSlug: string;
  lessonsCount: number;
  modules: CourseModuleSummary[];
};

export default function CourseContent({ courseSlug, lessonsCount, modules }: CourseContentProps) {
  return (
    <section className="course-content" id="course-roadmap">
      <header className="course-content__header">
        <div className="course-content__title">
          <h2>Learning Roadmap</h2>
          <span>{lessonsCount} lessons across hands-on AI engineering modules</span>
        </div>
      </header>

      <div className="course-content__modules">
        {modules.map((module, index) => (
          <article className="course-module" key={module.id}>
            <div className="course-module__topline">
              <div className="course-module__heading">
                <span>{index + 1}.</span>
                <h3>{module.name}</h3>
              </div>

              <button type="button" className="course-module__toggle" aria-label={`Show lessons from ${module.name}`}>
                <span>{module.lessons.length} lessons</span>
                <i aria-hidden="true">v</i>
              </button>
            </div>

            <p>{module.description}</p>

            <div className="course-module__lessons">
              {module.lessons.map((lesson) => (
                <Link
                  className="course-module__lesson-link"
                  key={lesson.id}
                  to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                >
                  <strong>{lesson.name}</strong>
                  <span>{lesson.description}</span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
