const lessonGroups = [
    {
        id: 'intro',
        title: 'Getting Started with Node.js',
        lessons: [
            { title: 'Introduction to Node.js', active: true, unlocked: true },
            { title: 'Running Node.js and Writing Basic Scripts', unlocked: false },
            { title: 'Quiz: Getting Started with Node.js', unlocked: false },
        ],
    },
    {
        id: 'modules',
        title: 'Global Objects and Modules',
        lessons: [
            { title: 'Working with JavaScript in Node.js', unlocked: false },
            { title: 'Introduction to Modules', unlocked: false },
            { title: 'Quiz: Global Objects and Modules', unlocked: false },
        ],
    },
    {
        id: 'async',
        title: 'Asynchronous Programming',
        lessons: [
            { title: 'Callbacks and the Event Loop', unlocked: false },
            { title: 'Promises in Practice', unlocked: false },
            { title: 'Async/Await Fundamentals', unlocked: false },
        ],
    },
]

export default function SideBar() {
    return (
        <aside className="lesson-sidebar">
            <div className="lesson-sidebar__header">
                <div>
                    <p className="lesson-sidebar__eyebrow">Course</p>
                    <h2>lorem Ipsum</h2>
                </div>
            </div>

            <label className="lesson-sidebar__search">
                <input type="text" placeholder="Search content" />
            </label>

            <div className="lesson-sidebar__chips">
                <button type="button" className="lesson-sidebar__chip is-active">All Lessons</button>
                <button type="button" className="lesson-sidebar__chip">Free Lessons (3)</button>
            </div>

            <div className="lesson-sidebar__sections">
                
            </div>
        </aside>
    );
}
