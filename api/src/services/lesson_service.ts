import { prisma } from '../config/prisma';

type LessonProgressInput = {
  completed?: boolean;
  progress?: number;
};

const clampProgress = (value: number): number => {
  return Math.min(100, Math.max(0, Math.round(value)));
};

const recalculateCourseProgress = async (userId: string, courseId: string): Promise<number> => {
  const lessons = await prisma.lesson.findMany({
    where: {
      module: {
        courseId,
      },
    },
    select: {
      id: true,
      lessonProgresses: {
        where: { userId },
        select: {
          progress: true,
        },
      },
    },
  });

  if (lessons.length === 0) {
    await prisma.progress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        progress: 0,
      },
      create: {
        userId,
        courseId,
        progress: 0,
      },
    });

    return 0;
  }

  const totalProgress = lessons.reduce((sum, lesson) => {
    const lessonProgress = lesson.lessonProgresses[0] as { progress: number } | undefined;

    if (!lessonProgress) {
      return sum;
    }

    return sum + clampProgress(lessonProgress.progress);
  }, 0);

  const courseProgress = totalProgress / lessons.length;

  await prisma.progress.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      progress: courseProgress,
    },
    create: {
      userId,
      courseId,
      progress: courseProgress,
    },
  });

  return courseProgress;
};

export const lessonService = {
  findByCourseAndLessonSlug(courseSlug: string, lessonSlug: string, userId: string) {
    return prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        module: {
          course: {
            slug: courseSlug,
          },
        },
      },
      include: {
        content: true,
        lessonProgresses: {
          where: { userId },
        },
        module: {
          include: {
            course: {
              include: {
                topic: {
                  include: {
                    subject: true,
                  },
                },
                progresses: {
                  where: { userId },
                },
                modules: {
                  orderBy: {
                    order: 'asc',
                  },
                  include: {
                    lessons: {
                      orderBy: {
                        order: 'asc',
                      },
                      include: {
                        lessonProgresses: {
                          where: { userId },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async updateLessonProgress(courseSlug: string, lessonSlug: string, userId: string, data: LessonProgressInput) {
    const lesson = await prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        module: {
          course: {
            slug: courseSlug,
          },
        },
      },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return null;
    }

    let progress = 0;

    if (typeof data.progress === 'number') {
      progress = clampProgress(data.progress);
    }

    let completed = false;

    if (typeof data.completed === 'boolean') {
      completed = data.completed;
    }

    if (completed && progress < 100) {
      progress = 100;
    }

    if (!completed && progress === 100) {
      completed = true;
    }

    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
      update: {
        progress,
        completed,
      },
      create: {
        userId,
        lessonId: lesson.id,
        progress,
        completed,
      },
    });

    const courseProgress = await recalculateCourseProgress(userId, lesson.module.course.id);

    return {
      lessonProgress,
      courseProgress,
    };
  },
};
