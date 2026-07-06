import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { CourseListItem } from '../../services/course_api';
import { getCourseLevel, getCourseStatus, getCourseSubject } from './courses_data';

type CoursesGridProps = {
  courses: CourseListItem[];
  error: string | null;
  isLoading: boolean;
};

const loadingCards = Array.from({ length: 6 }, (_, index) => `loading-course-${index}`);

export default function CoursesGrid({ courses, error, isLoading }: CoursesGridProps) {
  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading courses" aria-live="polite">
        {loadingCards.map((card) => (
          <Card className="animate-pulse" key={card}>
            <CardHeader>
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-7 w-4/5 rounded bg-muted" />
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="h-4 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </CardContent>
            <CardFooter>
              <div className="h-9 w-28 rounded bg-muted" />
            </CardFooter>
          </Card>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="grid" aria-live="polite">
        <Card>
          <CardHeader>
            <CardTitle>Could not load courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="grid" aria-live="polite">
        <Card>
          <CardHeader>
            <CardTitle>No courses found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Adjust the search term or select All Tracks to browse the full catalog.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Available courses">
      {courses.map((course) => (
        <Card className="h-full gap-4 rounded-lg" data-testid={`course-card-${course.slug}`} key={course.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{getCourseSubject(course)}</span>
              <span className="rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">{getCourseLevel(course)}</span>
            </div>

            <h2 className="text-xl font-semibold leading-tight tracking-normal">{course.title}</h2>
          </CardHeader>
          <CardContent className="grid flex-1 gap-4">
            <p className="text-sm leading-6 text-muted-foreground">{course.description}</p>

            <div>
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">{getCourseStatus(course)}</span>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>{course.lessonsCount} lessons</span>
              <span>{course.hoursCount}h</span>
            </div>
          </CardContent>

          <CardFooter>
            <Button asChild>
              <Link href={`/courses/${course.slug}`}>View course</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
