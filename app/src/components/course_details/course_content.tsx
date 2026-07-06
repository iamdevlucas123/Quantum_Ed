'use client'

import { useState } from 'react';
import Link from 'next/link';

import type { CourseModuleSummary } from '../../services/course_api';

type CourseContentProps = {
  courseSlug: string;
  lessonsCount: number;
  modules: CourseModuleSummary[];
};

const isModuleCompleted = (module: CourseModuleSummary): boolean => {
  return module.lessons.length > 0 && module.lessons.every((lesson) => {
    return lesson.lessonProgresses?.[0]?.completed === true;
  });
};

export default function CourseContent({ courseSlug, lessonsCount, modules }: CourseContentProps) {
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<number>>(() => {
    const firstModule = modules[0];
    return firstModule ? new Set([firstModule.id]) : new Set();
  });

  const toggleModule = (moduleId: number): void => {
    setExpandedModuleIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(moduleId)) {
        nextIds.delete(moduleId);
      } else {
        nextIds.add(moduleId);
      }

      return nextIds;
    });
  };

  return (
    <section className="course-content" id="course-roadmap">
      <header className="course-content__header">
        <div className="course-content__title">
          <h2>Learning Roadmap</h2>
          <span>{lessonsCount} lessons across hands-on AI engineering modules</span>
        </div>
      </header>

      <div className="course-content__modules">
        {modules.map((module, index) => {
          const isExpanded = expandedModuleIds.has(module.id);
          const isCompleted = isModuleCompleted(module);
          const lessonsId = `course-module-lessons-${module.id}`;

          return (
            <article className={`course-module ${isCompleted ? 'course-module--completed' : ''}`} key={module.id}>
              <div className="course-module__topline">
                <div className="course-module__heading">
                  <span>{index + 1}.</span>
                  <h3>{module.name}</h3>
                  {isCompleted ? <strong className="course-module__status">Completed</strong> : null}
                </div>

                <button
                  type="button"
                  className="course-module__toggle"
                  aria-controls={lessonsId}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Hide' : 'Show'} lessons from ${module.name}`}
                  onClick={() => toggleModule(module.id)}
                >
                  <span>{isExpanded ? 'Hide lessons' : `${module.lessons.length} lessons`}</span>
                  <i aria-hidden="true">v</i>
                </button>
              </div>

              <p>{module.description}</p>

              {isExpanded ? (
                <div className="course-module__lessons" id={lessonsId}>
                  {module.lessons.map((lesson) => (
                    <Link
                      className="course-module__lesson-link"
                      key={lesson.id}
                      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                    >
                      <strong>{lesson.name}</strong>
                      <span>{lesson.description}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
