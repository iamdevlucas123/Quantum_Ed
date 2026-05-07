export default function CourseMeta() {
  return (
    <div className="course-meta">
      <div className="course-meta__items">
        <span className="course-rating">★★★★☆ <strong>4.5</strong></span>
        <span><i aria-hidden="true">▣</i> 41 Lessons</span>
        <span><i aria-hidden="true">▥</i> 2 Breakout Sessions</span>
        <span><i aria-hidden="true">◔</i> Updated yesterday</span>
        <span><i aria-hidden="true">◴</i> 6h</span>
      </div>

      <div className="course-actions">
        <button type="button">Start Learning</button>
        <button type="button">Course Content <span aria-hidden="true">↓</span></button>
      </div>
    </div>
  );
}
