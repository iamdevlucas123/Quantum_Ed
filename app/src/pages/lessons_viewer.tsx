import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import '../styles/lessons_viewer_css/lessons_viewer.css';
import SideBar from '../components/lessons_viewer/sideBar';
import MainContent from '../components/lessons_viewer/mainContent';
import HeaderLessons from '../components/lessons_viewer/header_lessons';
import {
  getLessonBySlugs,
  updateLessonProgress,
  type LessonProgressResponse,
  type LessonViewerDetail,
} from '../services/lesson_api';

type NavigationLink = {
  href: string;
  label: string;
};

const applyProgressUpdate = (
  lesson: LessonViewerDetail,
  progressResponse: LessonProgressResponse,
): LessonViewerDetail => {
  const updatedLessonProgresses = [progressResponse.lessonProgress];
  const existingCourseProgress = lesson.module.course.progresses[0];
  const updatedCourseProgresses = [{
    id: existingCourseProgress ? existingCourseProgress.id : progressResponse.lessonProgress.id,
    progress: progressResponse.courseProgress,
  }];

  return {
    ...lesson,
    lessonProgresses: updatedLessonProgresses,
    module: {
      ...lesson.module,
      course: {
        ...lesson.module.course,
        progresses: updatedCourseProgresses,
        modules: lesson.module.course.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((currentLesson) => {
            if (currentLesson.id !== lesson.id) {
              return currentLesson;
            }

            return {
              ...currentLesson,
              lessonProgresses: updatedLessonProgresses,
            };
          }),
        })),
      },
    },
  };
};

function LessonsViewer() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const [lesson, setLesson] = useState<LessonViewerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseSlug || !lessonSlug) {
      setError('Lesson route is incomplete');
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setProgressError(null);

    getLessonBySlugs(courseSlug, lessonSlug)
      .then((data) => {
        if (isMounted) {
          setLesson(data);
        }
      })
      .catch((currentError) => {
        if (isMounted) {
          const message = currentError instanceof Error ? currentError.message : 'Could not load lesson';
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
  }, [courseSlug, lessonSlug]);

  const currentLessonProgress = lesson?.lessonProgresses[0]?.progress ?? 0;
  const currentCourseProgress = lesson?.module.course.progresses[0]?.progress ?? 0;
  const isLessonCompleted = lesson?.lessonProgresses[0]?.completed ?? false;

  const navigation = useMemo(() => {
    if (!lesson) {
      return { nextLesson: null as NavigationLink | null, previousLesson: null as NavigationLink | null };
    }

    const flatLessons = lesson.module.course.modules
      .flatMap((module) => module.lessons.map((currentLesson) => ({
        href: `/courses/${lesson.module.course.slug}/lessons/${currentLesson.slug}`,
        label: currentLesson.name,
        slug: currentLesson.slug,
      })));
    const currentIndex = flatLessons.findIndex((currentLesson) => currentLesson.slug === lesson.slug);

    return {
      previousLesson: currentIndex > 0 ? flatLessons[currentIndex - 1] : null,
      nextLesson: currentIndex >= 0 && currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null,
    };
  }, [lesson]);

  const handleProgressUpdate = async (progress: number, completed: boolean): Promise<void> => {
    if (!lesson || !courseSlug || !lessonSlug) {
      return;
    }

    setIsSavingProgress(true);
    setProgressError(null);

    try {
      const result = await updateLessonProgress(courseSlug, lessonSlug, {
        progress,
        completed,
      });

      setLesson((currentLesson) => {
        if (!currentLesson) {
          return currentLesson;
        }

        return applyProgressUpdate(currentLesson, result);
      });
    } catch (currentError) {
      const message = currentError instanceof Error ? currentError.message : 'Could not save lesson progress';
      setProgressError(message);
    } finally {
      setIsSavingProgress(false);
    }
  };

  if (isLoading) {
    return (
      <section className="lesson-viewer">
        <HeaderLessons backHref="/courses" courseTitle="Loading lesson" />
        <section className="lesson-layout">
          <main className="main-content">
            <section className="lesson-hero">
              <div className="lesson-hero__copy">
                <p className="lesson-hero__eyebrow">Current Lesson</p>
                <h1>Loading lesson</h1>
                <p>Syncing the lesson content and navigation path.</p>
              </div>
            </section>
          </main>
        </section>
      </section>
    );
  }

  if (error || !lesson) {
    return (
      <section className="lesson-viewer">
        <HeaderLessons backHref="/courses" courseTitle="Lesson unavailable" />
        <section className="lesson-layout">
          <main className="main-content">
            <section className="lesson-hero">
              <div className="lesson-hero__copy">
                <p className="lesson-hero__eyebrow">Current Lesson</p>
                <h1>Lesson unavailable</h1>
                <p>{error ?? 'The requested lesson could not be found.'}</p>
              </div>
            </section>
          </main>
        </section>
      </section>
    );
  }

  return (
    <section className="lesson-viewer">
      <HeaderLessons backHref={`/courses/${lesson.module.course.slug}`} courseTitle={lesson.module.course.title} />
      <section className="lesson-layout">
        <SideBar
          courseSlug={lesson.module.course.slug}
          courseTitle={lesson.module.course.title}
          courseProgress={currentCourseProgress}
          currentLessonSlug={lesson.slug}
          modules={lesson.module.course.modules}
        />
        <MainContent
          courseProgress={currentCourseProgress}
          currentLessonProgress={currentLessonProgress}
          isLessonCompleted={isLessonCompleted}
          isSavingProgress={isSavingProgress}
          lesson={lesson}
          nextLesson={navigation.nextLesson}
          onMarkCompleted={() => handleProgressUpdate(100, true)}
          onMarkStarted={() => handleProgressUpdate(Math.max(currentLessonProgress, 25), false)}
          previousLesson={navigation.previousLesson}
          progressError={progressError}
        />
      </section>
    </section>
  );
}

export default LessonsViewer;
