import { prisma } from '../config/prisma';

export const lessonService = {
  findByCourseAndLessonSlug(courseSlug: string, lessonSlug: string) {
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
        module: {
          include: {
            course: {
              include: {
                topic: {
                  include: {
                    subject: true,
                  },
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
};
