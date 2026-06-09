import '../../styles/courses_list_css/courses_filters.css';

const subjects = ['All Tracks', 'Mathematics', 'Physics', 'Software Systems', 'Quantum Labs'];

export default function CoursesFilters() {
  return (
    <section className="courses-filters" aria-label="Course filters">
      <label className="courses-filters__search">
        <img src="/assets/icons/quantum-atom-mark.png" alt="" />
        <input type="search" placeholder="Scan the catalog" aria-label="Search courses" />
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
