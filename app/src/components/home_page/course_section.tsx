
import '../../styles/course_section.css'



export default function CourseSection() {
    return (
        <section className="course-showcase">
            <div className="course-showcase__header">
                <p className="course-showcase__eyebrow">Roadmaps</p>
                <h2>Most Popular Courses</h2>
            </div>

            <div className="course-showcase__tabs" role="tablist" aria-label="Course roadmaps">
                <p>Subject 1</p>
                <p>Subject 2</p>
                <p>Subject 3</p>
                <p>Subject 4</p>
            </div>

            <p className="course-showcase__description">Lorem Ipsum</p>

            <div className="course-showcase__grid">
                <div className="course-card">
                    <h3>Course Title 1</h3>
                    <p>Brief description of the course.</p>
                </div>
                <div className="course-card">
                    <h3>Course Title 2</h3>
                    <p>Brief description of the course.</p>
                </div>
                <div className="course-card">
                    <h3>Course Title 3</h3>
                    <p>Brief description of the course.</p>
                </div>
            </div>
        </section>
    )
}
