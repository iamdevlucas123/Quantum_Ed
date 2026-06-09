import { courses } from './courses_data';
import '../../styles/courses_list_css/courses_grid.css';

export default function CoursesGrid() {
  return (
    <section className="courses-grid" aria-label="Available courses">
      {courses.map((course) => (
        <article className="courses-card" key={course.id}>
          <div className="courses-card__top">
            <span className="courses-card__subject">{course.subject}</span>
            <span className="courses-card__level">{course.level}</span>
          </div>

          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <div className="courses-card__status">
            <img src="/assets/sprites/laser-projectile-effects.png" alt="" />
            <span>{course.status}</span>
          </div>

          <div className="courses-card__meta">
            <span>{course.lessons} lessons</span>
            <span>{course.duration}</span>
          </div>

          <a href={`/courses/${course.id}`}>View course</a>
        </article>
      ))}
    </section>
  );
}
