import Link from 'next/link';
import '../../styles/lessons_viewer_css/lesson-topbar.css';

type HeaderLessonsProps = {
  backHref: string;
  courseTitle: string;
};

export default function HeaderLessons({ backHref, courseTitle }: HeaderLessonsProps) {
  return (
    <div className="lesson-viewer__topbar">
      <div className="lesson-viewer__topbar-left">
        <Link className="lesson-viewer__icon-button" href={backHref} aria-label="Go back to course">
          &#8592;
        </Link>
        <div className="lesson-viewer__brand">
          <span aria-hidden="true" />
          <span>{courseTitle}</span>
        </div>
      </div>
    </div>
  );
}
