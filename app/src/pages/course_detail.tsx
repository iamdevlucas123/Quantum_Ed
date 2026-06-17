import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import '../styles/course_detail_css/course-detail-hero.css';
import '../styles/course_detail_css/course-detail-meta.css';
import '../styles/course_detail_css/course-detail-objectives.css';
import '../styles/course_detail_css/course-detail-content.css';
import Header from '../components/header';
import GithubFooter from '../components/github_footer';
import CourseHero from '../components/course_details/courses_hero';
import CourseObjectives from '../components/course_details/course_objectives';
import CourseContent from '../components/course_details/course_content';
import { getCourseBySlug, saveCourse, unsaveCourse, type CourseDetail as CourseDetailData } from '../services/course_api';

function CourseDetail() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseSlug) {
      setError('Course slug not provided');
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setSaveError(null);

    getCourseBySlug(courseSlug)
      .then((data) => {
        if (isMounted) {
          setCourse(data);
        }
      })
      .catch((currentError) => {
        if (isMounted) {
          const message = currentError instanceof Error ? currentError.message : 'Could not load course';
          setError(message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [courseSlug]);

  const firstLessonHref = useMemo(() => {
    if (!course) {
      return null;
    }

    const firstModuleWithLesson = course.modules.find((module) => module.lessons.length > 0);
    const firstLesson = firstModuleWithLesson?.lessons[0];

    return firstLesson ? `/courses/${course.slug}/lessons/${firstLesson.slug}` : null;
  }, [course]);

  const handleToggleSave = async (): Promise<void> => {
    if (!course) {
      return;
    }

    setIsSavingCourse(true);
    setSaveError(null);

    try {
      const result = course.saved ? await unsaveCourse(course.slug) : await saveCourse(course.slug);

      setCourse((currentCourse) => {
        if (!currentCourse) {
          return currentCourse;
        }

        return {
          ...currentCourse,
          saved: result.saved,
        };
      });
    } catch (currentError) {
      const message = currentError instanceof Error ? currentError.message : 'Could not update saved course';
      setSaveError(message);
    } finally {
      setIsSavingCourse(false);
    }
  };

  return (
    <>
      <div className="course-detail-route">
        <Header />
        {isLoading ? (
          <section className="course-hero">
            <h1>Loading course</h1>
            <p>Syncing the AI engineering roadmap for this course.</p>
          </section>
        ) : error || !course ? (
          <section className="course-hero">
            <h1>Course unavailable</h1>
            <p>{error ?? 'This course could not be found.'}</p>
          </section>
        ) : (
          <>
            <CourseHero
              course={course}
              firstLessonHref={firstLessonHref}
              isSaved={course.saved ?? false}
              isSaving={isSavingCourse}
              onToggleSave={handleToggleSave}
              saveError={saveError}
            />
            <CourseObjectives objectives={course.learnObjectives} priorKnowledge={course.priorKnowledge} />
            <CourseContent courseSlug={course.slug} lessonsCount={course.lessonsCount} modules={course.modules} />
          </>
        )}
      </div>
      <GithubFooter />
    </>
  );
}

export default CourseDetail;
