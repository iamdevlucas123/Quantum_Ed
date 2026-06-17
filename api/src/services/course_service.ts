import { prisma } from '../config/prisma';

export const courseService = {
  findAll() {
    return prisma.course.findMany({
      include: {
        topic: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });
  },

  findBySlug(slug: string) {
    return prisma.course.findUnique({
      where: { slug },
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
    });
  },

  async findBySlugForUser(slug: string, userId: string) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        topic: {
          include: {
            subject: true,
          },
        },
        savedBy: {
          where: { userId },
          select: { id: true },
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
    });

    if (!course) {
      return null;
    }

    const { savedBy, ...courseDetail } = course;

    return {
      ...courseDetail,
      saved: savedBy.length > 0,
    };
  },

  async saveCourse(courseSlug: string, userId: string) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      return null;
    }

    await prisma.savedCourse.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        userId,
        courseId: course.id,
      },
    });

    return { saved: true };
  },

  async unsaveCourse(courseSlug: string, userId: string) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      return null;
    }

    await prisma.savedCourse.deleteMany({
      where: {
        userId,
        courseId: course.id,
      },
    });

    return { saved: false };
  },
};
