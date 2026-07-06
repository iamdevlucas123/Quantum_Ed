import Link from 'next/link';

import type { LessonViewerDetail } from '../../services/lesson_api';
import '../../styles/lessons_viewer_css/lesson-main-content.css';

type NavigationLink = {
  href: string;
  label: string;
};

type MainContentProps = {
  isCompletingLesson: boolean;
  isCompletingModule: boolean;
  lesson: LessonViewerDetail;
  nextLesson: NavigationLink | null;
  nextModule: NavigationLink | null;
  onCompleteLesson: () => Promise<void>;
  onNextModule: (href: string) => Promise<void>;
  previousLesson: NavigationLink | null;
};

const createParagraphs = (body: string): string[] => {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export default function MainContent({
  isCompletingLesson,
  isCompletingModule,
  lesson,
  nextLesson,
  nextModule,
  onCompleteLesson,
  onNextModule,
  previousLesson,
}: MainContentProps) {
  const paragraphs = createParagraphs(lesson.content?.body ?? lesson.description);
  const overview = lesson.content?.overview ?? lesson.description;
  const resources = lesson.content?.resources ?? [];
  const isLessonCompleted = lesson.lessonProgresses[0]?.completed === true;

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

      <section className="lesson-article">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="lesson-keypoints">
        <h3>Progress</h3>
        <button
          className="lesson-navigation__button"
          data-testid="lesson-complete-toggle"
          disabled={isCompletingLesson || isLessonCompleted}
          onClick={() => void onCompleteLesson()}
          type="button"
        >
          {isCompletingLesson ? 'Saving progress...' : isLessonCompleted ? 'Lesson completed' : 'Mark lesson complete'}
        </button>
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
          <Link className="lesson-navigation__button lesson-navigation__button--secondary" href={previousLesson.href}>
            Previous lesson
          </Link>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <Link className="lesson-navigation__button" href={nextLesson.href}>
            Next lesson
          </Link>
        ) : nextModule ? (
          <Link
            className="lesson-navigation__button"
            href={nextModule.href}
            aria-disabled={isCompletingModule}
            onClick={(event) => {
              event.preventDefault();

              if (!isCompletingModule) {
                void onNextModule(nextModule.href);
              }
            }}
          >
            {isCompletingModule ? 'Completing module...' : 'Next module'}
          </Link>
        ) : (
          <p className="lesson-navigation__complete">Course path completed</p>
        )}
      </footer>
    </main>
  );
}
