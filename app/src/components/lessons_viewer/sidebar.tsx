import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LessonSidebarModule } from '../../services/lesson_api';

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
    <aside className="grid gap-4 lg:sticky lg:top-20 lg:self-start">
      <Card>
        <CardHeader>
          <p className="text-xs font-medium uppercase text-muted-foreground">Course</p>
          <CardTitle className="text-lg leading-tight">{courseTitle}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="grid gap-3 pt-0">
          <strong className="text-3xl">{Math.round(courseProgress)}%</strong>
          <span className="text-sm text-muted-foreground">{completedLessons} of {totalLessons} lessons completed in this module</span>
          <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, courseProgress))}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-medium uppercase text-muted-foreground">Module {modulePosition} of {totalModules}</span>
              <CardTitle className="mt-1 text-base leading-tight">{activeModule.name}</CardTitle>
            </div>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{activeModule.lessons.length} lessons</span>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            {activeModule.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                className={cn(
                  'grid gap-1 rounded-md border p-3 text-sm transition hover:bg-accent hover:text-accent-foreground',
                  lesson.slug === currentLessonSlug ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : 'bg-background'
                )}
                href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
              >
                <strong>{lesson.name}</strong>
                <span className={cn('text-xs', lesson.slug === currentLessonSlug ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{getLessonStatus(lesson)}</span>
              </Link>
            ))}
          </div>

          {nextModule ? (
            <Link className="rounded-md border border-dashed p-3 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground" href={nextModule.href}>
              Next module: {nextModule.label}
            </Link>
          ) : (
            <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">Final module</p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
