import '../../styles/home_page_css/course_section.css'

const subjects = ['Quantum Basics', 'Algorithms', 'Physics Core', 'Engineering Lab']

const courses = [
    {
        title: 'Quantum Systems Boot Sequence',
        description: 'Understand qubits, gates and state evolution through structured mission-based lessons.',
        badge: 'Beginner',
        lessons: '18 lessons',
        duration: '12 hours',
    },
    {
        title: 'Orbit Mechanics for Developers',
        description: 'Connect mathematical modeling with simulation thinking and data-driven reasoning.',
        badge: 'Intermediate',
        lessons: '14 lessons',
        duration: '9 hours',
    },
    {
        title: 'Control Room Architecture',
        description: 'Design reliable learning systems with software engineering, feedback loops and observability.',
        badge: 'Advanced',
        lessons: '22 lessons',
        duration: '16 hours',
    },
]

export default function CourseSection() {
    return (
        <section className="course-showcase">
            <div className="course-showcase__header">
                <p className="course-showcase__eyebrow">Roadmaps</p>
                <h2>Mission tracks for high-signal learners</h2>
            </div>

            <div className="course-showcase__tabs" role="tablist" aria-label="Course roadmaps">
                {subjects.map((subject, index) => (
                    <button
                        key={subject}
                        type="button"
                        className={`course-showcase__tab ${index === 0 ? 'is-active' : ''}`}
                    >
                        {subject}
                    </button>
                ))}
            </div>

            <p className="course-showcase__description">
                Each track bundles theory, labs and milestone reviews so progress feels like operating a real command deck.
            </p>

            <div className="course-showcase__grid">
                {courses.map((course) => (
                    <article className="course-card" key={course.title}>
                        <div className="course-card__top">
                            <span className="course-card__badge">{course.badge}</span>
                        </div>

                        <div className="course-card__body">
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                        </div>

                        <div className="course-card__meta">
                            <span>{course.lessons}</span>
                            <span>{course.duration}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
