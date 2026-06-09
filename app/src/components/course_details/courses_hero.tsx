import CourseMeta from './course_meta';

export default function CourseHero() {
  return (
    <section className="course-hero">
      <div className="course-hero__tools">
        <button type="button" className="course-save">Save</button>
      </div>

      <h1>Lorem Lorem Lorem</h1>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, blanditiis. Excepturi architecto amet, nemo qui laboriosam, error consequuntur est ducimus cumque, veritatis expedita dicta enim cum velit hic vitae eveniet.
      </p>

      <CourseMeta />
    </section>
  );
}
