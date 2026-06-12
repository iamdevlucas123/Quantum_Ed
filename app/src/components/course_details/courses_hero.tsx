import type { CourseDetail } from '../../services/course_api';
import CourseMeta from './course_meta';

type CourseHeroProps = {
  course: CourseDetail;
  firstLessonHref: string | null;
};

export default function CourseHero({ course, firstLessonHref }: CourseHeroProps) {
  return (
    <section className="course-hero">
      <div className="course-hero__tools">
        <button type="button" className="course-save">Save</button>
      </div>

      <h1>{course.title}</h1>

      <p>{course.description}</p>

      <CourseMeta course={course} firstLessonHref={firstLessonHref} />
    </section>
  );
}
