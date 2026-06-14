import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AuthoringError } from './authoring_errors';
import {
  ensureUniqueCourseSlug,
  ensureUniqueLessonFields,
  ensureUniqueModuleFields,
  mapCourseInput,
  mapLessonContentInput,
  mapLessonInput,
  mapModuleInput,
  normalizeReorderItems,
  syncCourseMetrics,
} from './authoring_rules';
import type { CourseInput, LessonContentInput, LessonInput, ModuleInput } from './authoring_types';

export const authoringService = {
  async createCourse(input: CourseInput) {
    const data = await mapCourseInput(input, true);
    await ensureUniqueCourseSlug(data.slug as string);

    return prisma.course.create({
      data: {
        title: data.title as string,
        slug: data.slug as string,
        description: data.description as string,
        stars: data.stars as number,
        priorKnowledge: data.priorKnowledge as string[],
        learnObjectives: data.learnObjectives as string[],
        topicId: data.topicId as number,
      },
    });
  },

  async updateCourse(courseId: string, input: CourseInput) {
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!existingCourse) {
      throw new AuthoringError(404, 'Course not found');
    }

    const data = await mapCourseInput(input, false);

    if (data.slug !== undefined) {
      await ensureUniqueCourseSlug(data.slug, courseId);
    }

    return prisma.course.update({
      where: { id: courseId },
      data,
    });
  },

  async deleteCourse(courseId: string) {
    try {
      await prisma.course.delete({
        where: { id: courseId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AuthoringError(404, 'Course not found');
      }

      throw error;
    }
  },

  async createModule(courseId: string, input: ModuleInput) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      throw new AuthoringError(404, 'Course not found');
    }

    const data = mapModuleInput(input, true);
    await ensureUniqueModuleFields(courseId, data.slug, data.order);

    return prisma.module.create({
      data: {
        courseId,
        name: data.name as string,
        slug: data.slug as string,
        description: data.description as string,
        order: data.order as number,
      },
    });
  },

  async updateModule(moduleId: number, input: ModuleInput) {
    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true, courseId: true },
    });

    if (!existingModule) {
      throw new AuthoringError(404, 'Module not found');
    }

    const data = mapModuleInput(input, false);
    await ensureUniqueModuleFields(existingModule.courseId, data.slug, data.order, moduleId);

    return prisma.module.update({
      where: { id: moduleId },
      data,
    });
  },

  async deleteModule(moduleId: number) {
    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true, courseId: true },
    });

    if (!existingModule) {
      throw new AuthoringError(404, 'Module not found');
    }

    await prisma.module.delete({
      where: { id: moduleId },
    });

    await syncCourseMetrics(existingModule.courseId);
  },

  async reorderModules(courseId: string, items: unknown) {
    const normalizedItems = normalizeReorderItems(items);
    const existingModules = await prisma.module.findMany({
      where: { courseId },
      select: { id: true },
      orderBy: { order: 'asc' },
    });

    if (existingModules.length !== normalizedItems.length) {
      throw new AuthoringError(400, 'items must include every module in the course');
    }

    const existingModuleIds = new Set(existingModules.map((module) => module.id));

    for (const item of normalizedItems) {
      if (!existingModuleIds.has(item.id)) {
        throw new AuthoringError(400, 'items contain a module that does not belong to this course');
      }
    }

    await prisma.$transaction(
      normalizedItems.map((item) => prisma.module.update({
        where: { id: item.id },
        data: { order: item.order },
      })),
    );
  },

  async createLesson(moduleId: number, input: LessonInput) {
    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true, courseId: true },
    });

    if (!existingModule) {
      throw new AuthoringError(404, 'Module not found');
    }

    const data = mapLessonInput(input, true);
    await ensureUniqueLessonFields(moduleId, data.slug, data.order);

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        name: data.name as string,
        slug: data.slug as string,
        description: data.description as string,
        order: data.order as number,
      },
    });

    await syncCourseMetrics(existingModule.courseId);

    return lesson;
  },

  async updateLesson(lessonId: number, input: LessonInput) {
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, moduleId: true },
    });

    if (!existingLesson) {
      throw new AuthoringError(404, 'Lesson not found');
    }

    const data = mapLessonInput(input, false);
    await ensureUniqueLessonFields(existingLesson.moduleId, data.slug, data.order, lessonId);

    return prisma.lesson.update({
      where: { id: lessonId },
      data,
    });
  },

  async deleteLesson(lessonId: number) {
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        module: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!existingLesson) {
      throw new AuthoringError(404, 'Lesson not found');
    }

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    await syncCourseMetrics(existingLesson.module.courseId);
  },

  async reorderLessons(moduleId: number, items: unknown) {
    const normalizedItems = normalizeReorderItems(items);
    const existingLessons = await prisma.lesson.findMany({
      where: { moduleId },
      select: { id: true },
      orderBy: { order: 'asc' },
    });

    if (existingLessons.length !== normalizedItems.length) {
      throw new AuthoringError(400, 'items must include every lesson in the module');
    }

    const existingLessonIds = new Set(existingLessons.map((lesson) => lesson.id));

    for (const item of normalizedItems) {
      if (!existingLessonIds.has(item.id)) {
        throw new AuthoringError(400, 'items contain a lesson that does not belong to this module');
      }
    }

    await prisma.$transaction(
      normalizedItems.map((item) => prisma.lesson.update({
        where: { id: item.id },
        data: { order: item.order },
      })),
    );
  },

  async createLessonContent(lessonId: number, input: LessonContentInput) {
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        content: {
          select: { id: true },
        },
        module: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!existingLesson) {
      throw new AuthoringError(404, 'Lesson not found');
    }

    if (existingLesson.content) {
      throw new AuthoringError(409, 'Lesson content already exists');
    }

    const data = mapLessonContentInput(input, true);
    const content = await prisma.lessonContent.create({
      data: {
        lessonId,
        overview: data.overview ?? null,
        videoUrl: data.videoUrl ?? null,
        body: data.body as string,
        resources: data.resources as string[],
        exerciseCount: data.exerciseCount as number,
        durationMinutes: data.durationMinutes as number,
      },
    });

    await syncCourseMetrics(existingLesson.module.courseId);

    return content;
  },

  async updateLessonContent(lessonId: number, input: LessonContentInput) {
    const existingContent = await prisma.lessonContent.findUnique({
      where: { lessonId },
      select: {
        id: true,
        lesson: {
          select: {
            module: {
              select: {
                courseId: true,
              },
            },
          },
        },
      },
    });

    if (!existingContent) {
      throw new AuthoringError(404, 'Lesson content not found');
    }

    const data = mapLessonContentInput(input, false);
    const content = await prisma.lessonContent.update({
      where: { lessonId },
      data,
    });

    await syncCourseMetrics(existingContent.lesson.module.courseId);

    return content;
  },

  async deleteLessonContent(lessonId: number) {
    const existingContent = await prisma.lessonContent.findUnique({
      where: { lessonId },
      select: {
        id: true,
        lesson: {
          select: {
            module: {
              select: {
                courseId: true,
              },
            },
          },
        },
      },
    });

    if (!existingContent) {
      throw new AuthoringError(404, 'Lesson content not found');
    }

    await prisma.lessonContent.delete({
      where: { lessonId },
    });

    await syncCourseMetrics(existingContent.lesson.module.courseId);
  },
};

export { AuthoringError };
