const modules = [
    {
        title: 'Module 1',
        subtitle: 'Foundations',
        lessons: ['What is Linear Algebra?', 'Vectors and Notation', 'Coordinate Systems'],
    },
    {
        title: 'Module 2',
        subtitle: 'Matrices and Transformations',
        lessons: ['Matrix Operations', 'Linear Transformations', 'Change of Basis'],
    },
    {
        title: 'Module 3',
        subtitle: 'Eigen Concepts',
        lessons: ['Eigenvalues', 'Eigenvectors', 'Diagonalization'],
    },
];

export default function SideBar() {
    return (
        <aside className="side-bar">
            <div className="side-bar__header">
                <p className="side-bar__eyebrow">Current Track</p>
                <h2>Course Content</h2>
                <span className="side-bar__progress">16 of 24 lessons completed</span>
            </div>

            <div className="side-bar__modules">
                {modules.map((module, moduleIndex) => (
                    <section key={module.title} className="side-bar__module">
                        <div className="side-bar__module-head">
                            <span>{module.title}</span>
                            <p>{module.subtitle}</p>
                        </div>

                        <ul>
                            {module.lessons.map((lesson, lessonIndex) => (
                                <li
                                    key={lesson}
                                    className={moduleIndex === 1 && lessonIndex === 1 ? 'is-active' : ''}
                                >
                                    <button type="button">
                                        <span className="side-bar__lesson-index">
                                            {moduleIndex + 1}.{lessonIndex + 1}
                                        </span>
                                        <span>{lesson}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </aside>
    );
}
