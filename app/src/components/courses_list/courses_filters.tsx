import '../../styles/courses_list_css/course-list-filters.css';

type CoursesFiltersProps = {
  activeSubject: string;
  onSearchChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  searchTerm: string;
  subjects: string[];
  totalCourses: number;
};

export default function CoursesFilters({
  activeSubject,
  onSearchChange,
  onSubjectChange,
  searchTerm,
  subjects,
  totalCourses,
}: CoursesFiltersProps) {
  return (
    <section className="courses-filters" aria-label="Course filters">
      <div className="courses-filters__intro">
        <p className="courses-filters__eyebrow">AI Engineer Catalog</p>
        <h1>Short, focused courses for developers moving into AI engineering.</h1>
        <p>
          Study the smallest useful blocks: model APIs, prompt systems, retrieval, evaluation,
          production pipelines and shipping assistants that hold up in real products.
        </p>
        <span>{totalCourses} active courses</span>
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
        </label>

        <div className="courses-filters__subjects">
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
