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
};
