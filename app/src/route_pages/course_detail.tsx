'use client'

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import Header from '../components/header';
import GithubFooter from '../components/github_footer';
import CourseHero from '../components/course_details/courses_hero';
import CourseContent from '../components/course_details/course_content';
import { getCourseBySlug, saveCourse, unsaveCourse, type CourseDetail as CourseDetailData } from '../services/course_api';

function CourseDetail() {
  const params = useParams<{ courseSlug: string }>();
  const courseSlug = params?.courseSlug;
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
    <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
          {isLoading ? (
            <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
              <h1 className="text-3xl font-semibold tracking-normal">Loading course</h1>
              <p className="mt-3 text-muted-foreground">Syncing the AI engineering roadmap for this course.</p>
            </section>
          ) : error || !course ? (
            <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
              <h1 className="text-3xl font-semibold tracking-normal">Course unavailable</h1>
              <p className="mt-3 text-muted-foreground">{error ?? 'This course could not be found.'}</p>
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
              <CourseContent courseSlug={course.slug} lessonsCount={course.lessonsCount} modules={course.modules} />
            </>
          )}
        </main>
      <GithubFooter />
    </div>
  );
}

export default CourseDetail;
