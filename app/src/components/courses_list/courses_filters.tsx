import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type CoursesFiltersProps = {
  activeSubject: string;
  allCoursesCount: number;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  searchTerm: string;
  subjects: string[];
  totalCourses: number;
};

export default function CoursesFilters({
  activeSubject,
  allCoursesCount,
  isLoading,
  onSearchChange,
  onSubjectChange,
  searchTerm,
  subjects,
  totalCourses,
}: CoursesFiltersProps) {
  const trimmedSearchTerm = searchTerm.trim();
  const resultLabel = isLoading
    ? 'Loading catalog'
    : trimmedSearchTerm
      ? `${totalCourses} ${totalCourses === 1 ? 'result' : 'results'} for "${trimmedSearchTerm}"`
      : `${totalCourses} ${totalCourses === 1 ? 'course' : 'courses'} available`;

  return (
    <section className="grid gap-5 rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-6" aria-label="Course filters">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between" aria-live="polite">
        <span className="text-sm text-muted-foreground">{resultLabel}</span>
        <strong className="text-sm font-semibold">{allCoursesCount} total</strong>
      </div>

      <div className="grid gap-4">
        <Label className="relative block">
          <span className="sr-only">Search courses</span>
          <img className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 rounded-sm" src="/assets/icons/quantum-atom-mark.png" alt="" />
          <Input
            className="h-11 pl-10 pr-20"
            type="search"
            placeholder="Search AI engineering courses"
            aria-label="Search courses"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {searchTerm && (
            <Button
              className="absolute right-1 top-1/2 -translate-y-1/2"
              variant="ghost"
              size="sm"
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
            >
              Clear
            </Button>
          )}
        </Label>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter courses by track">
          {subjects.map((subject) => (
            <Button
              key={subject}
              type="button"
              variant={subject === activeSubject ? 'default' : 'outline'}
              size="sm"
              className={cn('max-w-full whitespace-normal text-left', subject !== activeSubject && 'bg-background')}
              aria-pressed={subject === activeSubject}
              onClick={() => onSubjectChange(subject)}
            >
              {subject}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
