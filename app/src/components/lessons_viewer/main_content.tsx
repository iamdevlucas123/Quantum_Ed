import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LessonViewerDetail } from '../../services/lesson_api';

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
    <main className="grid gap-5">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <span>Home</span>
        <span>&#8250;</span>
        <span>Courses</span>
        <span>&#8250;</span>
        <span>{lesson.module.course.title}</span>
        <span>&#8250;</span>
        <span>{lesson.name}</span>
      </nav>

      <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase text-muted-foreground">Current Lesson</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">{lesson.name}</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{overview}</p>
        </div>
      </section>

      <Card>
        <CardContent className="grid gap-4 pt-0 text-base leading-7 text-muted-foreground">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
        <Button
          data-testid="lesson-complete-toggle"
          disabled={isCompletingLesson || isLessonCompleted}
          onClick={() => void onCompleteLesson()}
          type="button"
        >
          {isCompletingLesson ? 'Saving progress...' : isLessonCompleted ? 'Lesson completed' : 'Mark lesson complete'}
        </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lesson details</CardTitle>
        </CardHeader>
        <CardContent>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          <li>{lesson.module.name}</li>
          <li>{lesson.content?.durationMinutes ? `${lesson.content.durationMinutes} minutes of study time` : 'Duration not yet defined'}</li>
          <li>{lesson.content?.exerciseCount ? `${lesson.content.exerciseCount} exercises in this lesson` : 'Exercises will be added with the lesson content'}</li>
          <li>{lesson.module.course.topic?.name ?? 'AI Engineering track'}</li>
        </ul>
        </CardContent>
      </Card>

      {resources.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            {resources.map((resource) => (
              <li key={resource}>{resource}</li>
            ))}
          </ul>
          </CardContent>
        </Card>
      ) : null}

      <footer className="flex items-center justify-between gap-3">
        {previousLesson ? (
          <Button asChild variant="outline">
            <Link href={previousLesson.href}>Previous lesson</Link>
          </Button>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <Button asChild>
            <Link href={nextLesson.href}>Next lesson</Link>
          </Button>
        ) : nextModule ? (
          <Button
            asChild
            aria-disabled={isCompletingModule}
          >
            <Link
            href={nextModule.href}
            onClick={(event) => {
              event.preventDefault();

              if (!isCompletingModule) {
                void onNextModule(nextModule.href);
              }
            }}
            >
              {isCompletingModule ? 'Completing module...' : 'Next module'}
            </Link>
          </Button>
        ) : (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">Course path completed</p>
        )}
      </footer>
    </main>
  );
}
