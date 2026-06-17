import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import SideBar from '../components/lessons_viewer/sidebar';
import MainContent from '../components/lessons_viewer/main_content';
import HeaderLessons from '../components/lessons_viewer/header_lessons';
import {
  getLessonBySlugs,
  type LessonViewerDetail,
} from '../services/lesson_api';

type NavigationLink = {
  href: string;
  label: string;
};

function LessonsViewer() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>();
  const [lesson, setLesson] = useState<LessonViewerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseSlug || !lessonSlug) {
      setError('Lesson route is incomplete');
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

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

  const currentCourseProgress = lesson?.module.course.progresses[0]?.progress ?? 0;

  const navigation = useMemo(() => {
    if (!lesson) {
      return {
        activeModule: null,
        currentModuleIndex: -1,
        nextLesson: null as NavigationLink | null,
        nextModule: null as NavigationLink | null,
        previousLesson: null as NavigationLink | null,
        totalModules: 0,
      };
    }

    const modules = lesson.module.course.modules;
    const activeModuleIndex = modules.findIndex((module) => module.id === lesson.module.id);
    const activeModule = activeModuleIndex >= 0 ? modules[activeModuleIndex] : null;
    const nextModule = activeModuleIndex >= 0 ? modules[activeModuleIndex + 1] : null;
    const nextModuleFirstLesson = nextModule?.lessons[0] ?? null;
    const activeModuleLessons = activeModule?.lessons ?? [];
    const currentLessonIndexInModule = activeModuleLessons.findIndex((currentLesson) => currentLesson.slug === lesson.slug);
    const nextLessonInModule = currentLessonIndexInModule >= 0
      ? activeModuleLessons[currentLessonIndexInModule + 1]
      : null;
    const flatLessons = modules
      .flatMap((module) => module.lessons.map((currentLesson) => ({
        href: `/courses/${lesson.module.course.slug}/lessons/${currentLesson.slug}`,
        label: currentLesson.name,
        slug: currentLesson.slug,
      })));
    const currentIndex = flatLessons.findIndex((currentLesson) => currentLesson.slug === lesson.slug);

    return {
      activeModule,
      currentModuleIndex: activeModuleIndex,
      previousLesson: currentIndex > 0 ? flatLessons[currentIndex - 1] : null,
      nextLesson: nextLessonInModule
        ? {
            href: `/courses/${lesson.module.course.slug}/lessons/${nextLessonInModule.slug}`,
            label: nextLessonInModule.name,
          }
        : null,
      nextModule: nextModuleFirstLesson
        ? {
            href: `/courses/${lesson.module.course.slug}/lessons/${nextModuleFirstLesson.slug}`,
            label: nextModule?.name ?? 'Next module',
          }
        : null,
      totalModules: modules.length,
    };
  }, [lesson]);

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
          activeModule={navigation.activeModule ?? lesson.module.course.modules[0]}
          courseSlug={lesson.module.course.slug}
          courseTitle={lesson.module.course.title}
          courseProgress={currentCourseProgress}
          currentModuleIndex={navigation.currentModuleIndex}
          currentLessonSlug={lesson.slug}
          nextModule={navigation.nextModule}
          totalModules={navigation.totalModules}
        />
        <MainContent
          lesson={lesson}
          nextLesson={navigation.nextLesson}
          nextModule={navigation.nextModule}
          previousLesson={navigation.previousLesson}
        />
      </section>
    </section>
  );
}

export default LessonsViewer;
