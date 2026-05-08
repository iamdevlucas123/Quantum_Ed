import '../../styles/courses_list_css/courses_filters.css';

const subjects = ['All', 'Mathematics', 'Physics', 'Computer Science', 'Quantum Computing'];

export default function CoursesFilters() {
  return (
    <section className="courses-filters" aria-label="Course filters">
      <label className="courses-filters__search">
        <span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Search courses" aria-label="Search courses" />
      </label>

      <div className="courses-filters__subjects">
        {subjects.map((subject, index) => (
          <button
            key={subject}
            type="button"
            className={index === 0 ? 'is-active' : ''}
            aria-pressed={index === 0}
          >
            {subject}
          </button>
        ))}
      </div>
    </section>
  );
}
