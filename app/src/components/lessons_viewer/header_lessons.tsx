import Link from 'next/link';

import { Button } from '@/components/ui/button';

type HeaderLessonsProps = {
  backHref: string;
  courseTitle: string;
};

export default function HeaderLessons({ backHref, courseTitle }: HeaderLessonsProps) {
  return (
    <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button asChild variant="outline" size="icon-sm">
          <Link href={backHref} aria-label="Go back to course">
            <span aria-hidden="true">&#8592;</span>
          </Link>
        </Button>
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span className="truncate text-sm font-medium">{courseTitle}</span>
        </div>
      </div>
    </div>
  );
}
