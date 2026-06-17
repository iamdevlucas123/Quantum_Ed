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
    <section className="course-hero">
      <div className="course-hero__tools">
        <button
          type="button"
          className="course-save"
          aria-pressed={isSaved}
          disabled={isSaving}
          onClick={onToggleSave}
        >
          {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
      {saveError ? <p className="course-hero__save-error" aria-live="polite">{saveError}</p> : null}

      <h1>{course.title}</h1>

      <p>{course.description}</p>

      <CourseMeta course={course} firstLessonHref={firstLessonHref} />
    </section>
  );
}
