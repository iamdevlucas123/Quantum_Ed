import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { CourseDetail } from '../../services/course_api';

type CourseMetaProps = {
  course: CourseDetail;
  firstLessonHref: string | null;
};

export default function CourseMeta({ course, firstLessonHref }: CourseMetaProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <span className="rounded-lg border bg-background p-3 text-sm">
          <strong>{course.stars.toFixed(1)} rating</strong>
        </span>
        <span className="rounded-lg border bg-background p-3 text-sm">
          <strong>{course.lessonsCount} lessons</strong>
        </span>
        <span className="rounded-lg border bg-background p-3 text-sm">
          <strong>{course.modules.length} modules</strong>
        </span>
        <span className="rounded-lg border bg-background p-3 text-sm">
          <strong>{course.topic?.subject?.name ?? 'AI Engineering'}</strong>
        </span>
        <span className="rounded-lg border bg-background p-3 text-sm">
          <strong>{course.hoursCount}h</strong>
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {firstLessonHref ? (
          <Button asChild>
            <Link href={firstLessonHref}>Start Learning</Link>
          </Button>
        ) : (
          <Button type="button">Start Learning</Button>
        )}
        <Button asChild variant="outline">
          <a href="#course-roadmap">Course Content</a>
        </Button>
      </div>
    </div>
  );
}
