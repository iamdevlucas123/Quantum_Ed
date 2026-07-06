import Link from 'next/link';

import type { LessonSidebarModule } from '../../services/lesson_api';
import '../../styles/lessons_viewer_css/lesson-sidebar.css';

type SideBarProps = {
  activeModule: LessonSidebarModule;
  courseSlug: string;
  courseProgress: number;
  courseTitle: string;
  currentModuleIndex: number;
  currentLessonSlug: string;
  nextModule: {
    href: string;
    label: string;
  } | null;
  totalModules: number;
};

const getLessonStatus = (moduleLesson: LessonSidebarModule['lessons'][number]): string => {
  const lessonProgress = moduleLesson.lessonProgresses[0];

  if (!lessonProgress) {
    return 'Not started';
  }

  if (lessonProgress.completed) {
    return 'Completed';
  }

  return `${Math.round(lessonProgress.progress)}% complete`;
};

export default function SideBar({
  activeModule,
  courseSlug,
  courseProgress,
  courseTitle,
  currentModuleIndex,
  currentLessonSlug,
  nextModule,
  totalModules,
}: SideBarProps) {
  const totalLessons = activeModule.lessons.length;
  const completedLessons = activeModule.lessons.filter((lesson) => lesson.lessonProgresses[0]?.completed).length;
  const modulePosition = currentModuleIndex >= 0 ? currentModuleIndex + 1 : 1;

  return (
    <aside className="lesson-sidebar">
      <div className="lesson-sidebar__header">
        <div>
          <p className="lesson-sidebar__eyebrow">Course</p>
          <h2>{courseTitle}</h2>
        </div>
      </div>

      <div className="lesson-sidebar__progress-card">
        <strong>{Math.round(courseProgress)}%</strong>
        <span>{completedLessons} of {totalLessons} lessons completed in this module</span>
        <div aria-hidden="true">
          <span style={{ width: `${Math.max(0, Math.min(100, courseProgress))}%` }} />
        </div>
      </div>

      <div className="lesson-sidebar__sections">
        <section className="lesson-sidebar__section">
          <div className="lesson-sidebar__section-header">
            <div>
              <span>Module {modulePosition} of {totalModules}</span>
              <strong>{activeModule.name}</strong>
            </div>
            <span>{activeModule.lessons.length} lessons</span>
          </div>

          <div className="lesson-sidebar__section-links">
            {activeModule.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                className={lesson.slug === currentLessonSlug ? 'is-active' : undefined}
                href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
              >
                <strong>{lesson.name}</strong>
                <span>{getLessonStatus(lesson)}</span>
              </Link>
            ))}
          </div>

          {nextModule ? (
            <Link className="lesson-sidebar__next-module" href={nextModule.href}>
              Next module: {nextModule.label}
            </Link>
          ) : (
            <p className="lesson-sidebar__complete">Final module</p>
          )}
        </section>
      </div>
    </aside>
  );
}
