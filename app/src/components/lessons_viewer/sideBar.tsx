    
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
