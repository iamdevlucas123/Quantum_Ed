import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileCourseProgressProps } from './profile_types';

export default function ProfileCourseProgress({
  error,
  isLoading,
  items,
  summary,
}: ProfileCourseProgressProps) {
  return (
    <Card id="profile-courses">
      <CardHeader className="sm:flex sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Your Courses</CardTitle>
        <a className="text-sm font-medium underline-offset-4 hover:underline" href="/courses">View all courses</a>
      </CardHeader>
      <CardContent className="grid gap-5">

      {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p> : null}

      {!isLoading && items.length === 0 ? (
        <div className="rounded-lg border bg-background p-4">
          <h3 className="font-semibold">No courses tracked yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Start a course to populate your progress dashboard and study activity timeline.</p>
          <Button asChild className="mt-4" variant="outline">
            <a href="/courses">Browse courses</a>
          </Button>
        </div>
      ) : null}

      {summary.featuredCourses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {summary.featuredCourses.map((course) => (
            <article className="rounded-lg border bg-background p-4" key={course.id}>
              <h3 className="font-semibold">{course.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{course.level}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <strong>{course.progress}%</strong>
                <Button type="button" variant="outline" size="sm">Continue</Button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {summary.currentCourse ? (
        <article className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Current Course</span>
              <small className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">In Progress</small>
            </div>
            <h3 className="mt-2 text-lg font-semibold">{summary.currentCourse.title}</h3>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${summary.currentCourse.progress}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>
                {Math.max(1, Math.round((summary.currentCourse.lessonsCount * summary.currentCourse.progress) / 100))} /{' '}
                {summary.currentCourse.lessonsCount} modules completed
              </span>
              <strong className="text-foreground">{summary.currentCourse.progress}%</strong>
            </div>
          </div>
          <Button type="button">Continue Learning</Button>
        </article>
      ) : null}
      </CardContent>
    </Card>
  );
}
