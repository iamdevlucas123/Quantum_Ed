'use client'

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import SideBar from '../components/lessons_viewer/sidebar';
import MainContent from '../components/lessons_viewer/main_content';
import HeaderLessons from '../components/lessons_viewer/header_lessons';
import {
  getLessonBySlugs,
  updateLessonProgress,
  type LessonViewerDetail,
} from '../services/lesson_api';

type NavigationLink = {
  href: string;
  label: string;
};

function LessonsViewer() {
  const params = useParams<{ courseSlug: string; lessonSlug: string }>();
  const courseSlug = params?.courseSlug;
  const lessonSlug = params?.lessonSlug;
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonViewerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompletingLesson, setIsCompletingLesson] = useState(false);
  const [isCompletingModule, setIsCompletingModule] = useState(false);

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

  const handleNextModule = async (href: string): Promise<void> => {
    if (!courseSlug || !lessonSlug) {
      router.push(href);
      return;
    }

    setIsCompletingModule(true);

    try {
      await updateLessonProgress(courseSlug, lessonSlug, {
        completed: true,
        progress: 100,
      });
    } finally {
      setIsCompletingModule(false);
      router.push(href);
    }
  };

  const handleCompleteLesson = async (): Promise<void> => {
    if (!courseSlug || !lessonSlug || !lesson) {
      return;
    }

    setIsCompletingLesson(true);

    try {
      const result = await updateLessonProgress(courseSlug, lessonSlug, {
        completed: true,
        progress: 100,
      });

      setLesson((currentLesson) => {
        if (!currentLesson) {
          return currentLesson;
        }

        return {
          ...currentLesson,
          lessonProgresses: [result.lessonProgress],
          module: {
            ...currentLesson.module,
            course: {
              ...currentLesson.module.course,
              progresses: [
                {
                  id: result.lessonProgress.id,
                  progress: result.courseProgress,
                },
              ],
              modules: currentLesson.module.course.modules.map((module) => ({
                ...module,
                lessons: module.lessons.map((moduleLesson) => {
                  if (moduleLesson.slug !== currentLesson.slug) {
                    return moduleLesson;
                  }

                  return {
                    ...moduleLesson,
                    lessonProgresses: [result.lessonProgress],
                  };
                }),
              })),
            },
          },
        };
      });
    } finally {
      setIsCompletingLesson(false);
    }
  };

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
      <section className="min-h-screen bg-background text-foreground">
        <HeaderLessons backHref="/courses" courseTitle="Loading lesson" />
        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <main>
            <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
              <p className="text-xs font-medium uppercase text-muted-foreground">Current Lesson</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal">Loading lesson</h1>
              <p className="mt-3 text-muted-foreground">Syncing the lesson content and navigation path.</p>
            </section>
          </main>
        </section>
      </section>
    );
  }

  if (error || !lesson) {
    return (
      <section className="min-h-screen bg-background text-foreground">
        <HeaderLessons backHref="/courses" courseTitle="Lesson unavailable" />
        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <main>
            <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
              <p className="text-xs font-medium uppercase text-muted-foreground">Current Lesson</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal">Lesson unavailable</h1>
              <p className="mt-3 text-muted-foreground">{error ?? 'The requested lesson could not be found.'}</p>
            </section>
          </main>
        </section>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background text-foreground">
      <HeaderLessons backHref={`/courses/${lesson.module.course.slug}`} courseTitle={lesson.module.course.title} />
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[20rem_1fr] lg:px-8">
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
          isCompletingLesson={isCompletingLesson}
          isCompletingModule={isCompletingModule}
          lesson={lesson}
          nextLesson={navigation.nextLesson}
          nextModule={navigation.nextModule}
          onCompleteLesson={handleCompleteLesson}
          onNextModule={handleNextModule}
          previousLesson={navigation.previousLesson}
        />
      </section>
    </section>
  );
}

export default LessonsViewer;
