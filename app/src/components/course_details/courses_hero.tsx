import { Button } from '@/components/ui/button';
import type { CourseDetail } from '../../services/course_api';
import CourseMeta from './course_meta';

type CourseHeroProps = {
  course: CourseDetail;
  firstLessonHref: string | null;
  isSaved: boolean;
  isSaving: boolean;
  onToggleSave: () => void;
  saveError: string | null;
};

export default function CourseHero({
  course,
  firstLessonHref,
  isSaved,
  isSaving,
  onToggleSave,
  saveError,
}: CourseHeroProps) {
  return (
    <section className="grid gap-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
      <div className="flex justify-end">
        <Button
          type="button"
          variant={isSaved ? 'secondary' : 'outline'}
          aria-pressed={isSaved}
          disabled={isSaving}
          onClick={onToggleSave}
        >
          {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
        </Button>
      </div>
      {saveError ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" aria-live="polite">{saveError}</p> : null}

      <div className="max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">{course.title}</h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{course.description}</p>
      </div>

      <CourseMeta course={course} firstLessonHref={firstLessonHref} />
    </section>
  );
}
