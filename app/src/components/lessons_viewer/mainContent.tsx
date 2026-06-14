import { Link } from 'react-router-dom';

import type { LessonViewerDetail } from '../../services/lesson_api';

type NavigationLink = {
  href: string;
  label: string;
};

type MainContentProps = {
  courseProgress: number;
  currentLessonProgress: number;
  isLessonCompleted: boolean;
  isSavingProgress: boolean;
  lesson: LessonViewerDetail;
  nextLesson: NavigationLink | null;
  onMarkCompleted: () => void;
  onMarkStarted: () => void;
  previousLesson: NavigationLink | null;
  progressError: string | null;
};

const createParagraphs = (body: string): string[] => {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export default function MainContent({
  courseProgress,
  currentLessonProgress,
  isLessonCompleted,
  isSavingProgress,
  lesson,
  nextLesson,
  onMarkCompleted,
  onMarkStarted,
  previousLesson,
  progressError,
}: MainContentProps) {
  const paragraphs = createParagraphs(lesson.content?.body ?? lesson.description);
  const overview = lesson.content?.overview ?? lesson.description;
  const resources = lesson.content?.resources ?? [];
  const lessonStatusLabel = isLessonCompleted ? 'Completed' : currentLessonProgress > 0 ? 'In progress' : 'Not started';

  return (
    <main className="main-content">
      <nav className="main-content__breadcrumb" aria-label="Breadcrumb">
        <span>Home</span>
        <span>&#8250;</span>
        <span>Courses</span>
        <span>&#8250;</span>
        <span>{lesson.module.course.title}</span>
        <span>&#8250;</span>
        <span>{lesson.name}</span>
      </nav>

      <section className="lesson-hero">
        <div className="lesson-hero__copy">
          <p className="lesson-hero__eyebrow">Current Lesson</p>
          <h1>{lesson.name}</h1>
          <p>{overview}</p>
        </div>

        <div className="lesson-hero__tools" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="lesson-progress-panel">
        <div className="lesson-progress-panel__summary">
          <div>
            <p className="lesson-progress-panel__label">Lesson progress</p>
            <strong>{Math.round(currentLessonProgress)}%</strong>
            <span>{lessonStatusLabel}</span>
          </div>

          <div>
            <p className="lesson-progress-panel__label">Course progress</p>
            <strong>{Math.round(courseProgress)}%</strong>
            <span>Aggregated from lesson completion</span>
          </div>
        </div>

        <div className="lesson-progress-panel__bars" aria-hidden="true">
          <div>
            <span style={{ width: `${Math.max(0, Math.min(100, currentLessonProgress))}%` }} />
          </div>
          <div>
            <span style={{ width: `${Math.max(0, Math.min(100, courseProgress))}%` }} />
          </div>
        </div>

        <div className="lesson-progress-panel__actions">
          <button
            className="lesson-progress-panel__button lesson-progress-panel__button--secondary"
            disabled={isSavingProgress || isLessonCompleted}
            onClick={onMarkStarted}
            type="button"
          >
            {isSavingProgress ? 'Saving progress' : 'Mark as started'}
          </button>
          <button
            className="lesson-progress-panel__button"
            disabled={isSavingProgress || isLessonCompleted}
            onClick={onMarkCompleted}
            type="button"
          >
            {isLessonCompleted ? 'Lesson completed' : isSavingProgress ? 'Saving progress' : 'Mark as completed'}
          </button>
        </div>

        {progressError ? <p className="lesson-progress-panel__error">{progressError}</p> : null}
      </section>

      <section className="lesson-article">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="lesson-keypoints">
        <h3>Lesson details</h3>
        <ul>
          <li>{lesson.module.name}</li>
          <li>{lesson.content?.durationMinutes ? `${lesson.content.durationMinutes} minutes of study time` : 'Duration not yet defined'}</li>
          <li>{lesson.content?.exerciseCount ? `${lesson.content.exerciseCount} exercises in this lesson` : 'Exercises will be added with the lesson content'}</li>
          <li>{lesson.module.course.topic?.name ?? 'AI Engineering track'}</li>
        </ul>
      </section>

      {resources.length > 0 ? (
        <section className="lesson-keypoints">
          <h3>Resources</h3>
          <ul>
            {resources.map((resource) => (
              <li key={resource}>{resource}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="lesson-navigation">
        {previousLesson ? (
          <Link className="lesson-navigation__button lesson-navigation__button--secondary" to={previousLesson.href}>
            Previous lesson
          </Link>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <Link className="lesson-navigation__button" to={nextLesson.href}>
            Next lesson
          </Link>
        ) : (
          <span />
        )}
      </footer>
    </main>
  );
}
