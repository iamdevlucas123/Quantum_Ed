const roadmapModules = [
  {
    title: 'Lorem Ipsum Dolor Sit Amet Consectetur',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    lessons: 6,
  },
  {
    title: 'Lorem Ipsum Dolor Sit Amet Consectetur',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    lessons: 4,
  },
  {
    title: 'Lorem Lorem Ipsum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    lessons: 5,
  },
];

export default function CourseContent() {
  return (
    <section className="course-content">
      <header className="course-content__header">
        <div className="course-content__title">
          <h2>Learning Roadmap</h2>
          <span>41 Lessons • 8 Quizzes</span>
        </div>
      </header>

      <div className="course-content__toolbar">
        <label className="course-content__search">
          <span aria-hidden="true">[]</span>
          <input type="search" placeholder="Search Lessons" aria-label="Search lessons" />
        </label>

        <button type="button" className="course-content__expand">
          Expand All <span aria-hidden="true">+-</span>
        </button>
      </div>

      <div className="course-content__modules">
        {roadmapModules.map((module, index) => (
          <article className="course-module" key={module.title}>
            <div className="course-module__topline">
              <div className="course-module__heading">
                <span>{index + 1}.</span>
                <h3>{module.title}</h3>
              </div>

              <button type="button" className="course-module__toggle" aria-label={`Expand ${module.title}`}>
                <span>{module.lessons} Lessons</span>
                <i aria-hidden="true">v</i>
              </button>
            </div>

            <p>{module.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
