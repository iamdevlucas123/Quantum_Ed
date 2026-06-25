import { prisma } from '../../config/prisma';

export const INTEGRATION_EMAIL_PREFIX = 'integration+';
export const INTEGRATION_COURSE_SLUG = 'integration-test-course';
export const INTEGRATION_LESSON_SLUG = 'integration-test-lesson';

export const uniqueIntegrationEmail = (scope = 'default') => {
  return `${INTEGRATION_EMAIL_PREFIX}${scope}+${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
};

export const cleanupIntegrationUsers = async (scope?: string): Promise<void> => {
  const prefix = scope ? `${INTEGRATION_EMAIL_PREFIX}${scope}+` : INTEGRATION_EMAIL_PREFIX;

  await prisma.user.deleteMany({
    where: {
      email: {
        startsWith: prefix,
      },
    },
  });
};

export const findIntegrationCourse = () => {
  return prisma.course.findUnique({
    where: { slug: INTEGRATION_COURSE_SLUG },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
};

export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
};
