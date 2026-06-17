import '../../styles/courses_list_css/course-list-filters.css';

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
    <section className="courses-filters" aria-label="Course filters">
      <div className="courses-filters__summary" aria-live="polite">
        <span>{resultLabel}</span>
        <strong>{allCoursesCount} total</strong>
      </div>

      <div className="courses-filters__controls">
        <label className="courses-filters__search">
          <img src="/assets/icons/quantum-atom-mark.png" alt="" />
          <input
            type="search"
            placeholder="Search AI engineering courses"
            aria-label="Search courses"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {searchTerm && (
            <button
              className="courses-filters__clear"
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
            >
              Clear
            </button>
          )}
        </label>

        <div className="courses-filters__subjects" role="group" aria-label="Filter courses by track">
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              className={subject === activeSubject ? 'is-active' : ''}
              aria-pressed={subject === activeSubject}
              onClick={() => onSubjectChange(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
