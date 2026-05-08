const roadmapModules = [
  {
    title: 'Agent Design Fundamentals',
    description:
      'Learn core AI agent components, architecture, and how they perceive, reason, and act. Master orchestration, safety, and key design challenges.',
    lessons: 6,
  },
  {
    title: 'Multi-Agent Conversational Recommender System (MACRS)',
    description:
      'Explore MACRS, a multi-agent system for goal-directed conversational recommendations. See how it plans, uses reflection, and achieves superior performance.',
    lessons: 4,
  },
  {
    title: 'Design Your First Agent',
    description:
      'Turn agent patterns into a practical architecture with tools, memory, planning loops, and evaluation checkpoints.',
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
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Search Lessons" aria-label="Search lessons" />
        </label>

        <button type="button" className="course-content__expand">
          Expand All <span aria-hidden="true">↕</span>
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
                <i aria-hidden="true">⌄</i>
              </button>
            </div>

            <p>{module.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
