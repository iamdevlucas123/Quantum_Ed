import { prisma } from '../config/prisma';
import { AuthoringError } from './authoring_errors';
import type {
  CourseInput,
  LessonContentInput,
  LessonInput,
  ModuleInput,
  ReorderItem,
} from './types/authoring_types';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const ensureString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AuthoringError(400, `${field} is required`);
  }

  return value.trim();
};

const ensureOptionalString = (value: unknown, field: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return ensureString(value, field);
};

const ensureSlug = (value: unknown, field: string): string => {
  const slug = ensureString(value, field);

  if (!slugPattern.test(slug)) {
    throw new AuthoringError(400, `${field} must use kebab-case`);
  }

  return slug;
};

const ensureOptionalSlug = (value: unknown, field: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return ensureSlug(value, field);
};

const ensurePositiveOrder = (value: unknown, field: string): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new AuthoringError(400, `${field} must be an integer greater than or equal to 1`);
  }

  return value;
};

const ensureOptionalPositiveOrder = (value: unknown, field: string): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return ensurePositiveOrder(value, field);
};

const ensureNonNegativeNumber = (value: unknown, field: string): number => {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    throw new AuthoringError(400, `${field} must be a number greater than or equal to 0`);
  }

  return value;
};

const ensureOptionalNonNegativeNumber = (value: unknown, field: string): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return ensureNonNegativeNumber(value, field);
};

const ensureStringArray = (value: unknown, field: string): string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new AuthoringError(400, `${field} must be an array of strings`);
  }

  return value;
};

const ensureOptionalStringArray = (value: unknown, field: string): string[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return ensureStringArray(value, field);
};

const ensureCourseStars = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) {
    throw new AuthoringError(400, 'stars must be an integer between 1 and 5');
  }

  return value;
};

const ensureOptionalCourseStars = (value: unknown): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return ensureCourseStars(value);
};

export const ensureUniqueCourseSlug = async (slug: string, excludeCourseId?: string): Promise<void> => {
  const existingCourse = await prisma.course.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingCourse && existingCourse.id !== excludeCourseId) {
    throw new AuthoringError(409, 'Course slug already exists');
  }
};

export const ensureUniqueModuleFields = async (
  courseId: string,
  slug: string | undefined,
  order: number | undefined,
  excludeModuleId?: number,
): Promise<void> => {
  if (slug !== undefined) {
    const existingModule = await prisma.module.findFirst({
      where: { courseId, slug },
      select: { id: true },
    });

    if (existingModule && existingModule.id !== excludeModuleId) {
      throw new AuthoringError(409, 'Module slug already exists in this course');
    }
  }

  if (order !== undefined) {
    const existingModule = await prisma.module.findFirst({
      where: { courseId, order },
      select: { id: true },
    });

    if (existingModule && existingModule.id !== excludeModuleId) {
      throw new AuthoringError(409, 'Module order already exists in this course');
    }
  }
};

export const ensureUniqueLessonFields = async (
  moduleId: number,
  slug: string | undefined,
  order: number | undefined,
  excludeLessonId?: number,
): Promise<void> => {
  if (slug !== undefined) {
    const existingLesson = await prisma.lesson.findFirst({
      where: { moduleId, slug },
      select: { id: true },
    });

    if (existingLesson && existingLesson.id !== excludeLessonId) {
      throw new AuthoringError(409, 'Lesson slug already exists in this module');
    }
  }

  if (order !== undefined) {
    const existingLesson = await prisma.lesson.findFirst({
      where: { moduleId, order },
      select: { id: true },
    });

    if (existingLesson && existingLesson.id !== excludeLessonId) {
      throw new AuthoringError(409, 'Lesson order already exists in this module');
    }
  }
};

export const normalizeReorderItems = (items: unknown): Array<{ id: number; order: number }> => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AuthoringError(400, 'items must be a non-empty array');
  }

  const normalizedItems = items.map((item) => {
    const currentItem = item as ReorderItem;

    return {
      id: ensurePositiveOrder(currentItem.id, 'id'),
      order: ensurePositiveOrder(currentItem.order, 'order'),
    };
  });

  const uniqueIds = new Set(normalizedItems.map((item) => item.id));

  if (uniqueIds.size !== normalizedItems.length) {
    throw new AuthoringError(400, 'items must not contain duplicate ids');
  }

  return normalizedItems
    .sort((left, right) => left.order - right.order)
    .map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));
};

export const syncCourseMetrics = async (courseId: string): Promise<void> => {
  const lessonsCount = await prisma.lesson.count({
    where: {
      module: {
        courseId,
      },
    },
  });

  const contentAggregate = await prisma.lessonContent.aggregate({
    where: {
      lesson: {
        module: {
          courseId,
        },
      },
    },
    _sum: {
      durationMinutes: true,
    },
  });

  const totalMinutes = contentAggregate._sum.durationMinutes ?? 0;

  await prisma.course.update({
    where: { id: courseId },
    data: {
      lessonsCount,
      hoursCount: totalMinutes === 0 ? 0 : Math.ceil(totalMinutes / 60),
    },
  });
};

const ensureTopicExists = async (topicId: number): Promise<void> => {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    select: { id: true },
  });

  if (!topic) {
    throw new AuthoringError(404, 'Topic not found');
  }
};

export const mapCourseInput = async (input: CourseInput, isCreate: boolean) => {
  const title = isCreate ? ensureString(input.title, 'title') : ensureOptionalString(input.title, 'title');
  const slug = isCreate ? ensureSlug(input.slug, 'slug') : ensureOptionalSlug(input.slug, 'slug');
  const description = isCreate ? ensureString(input.description, 'description') : ensureOptionalString(input.description, 'description');
  const stars = isCreate ? ensureCourseStars(input.stars) : ensureOptionalCourseStars(input.stars);
  const priorKnowledge = isCreate
    ? ensureStringArray(input.priorKnowledge, 'priorKnowledge')
    : ensureOptionalStringArray(input.priorKnowledge, 'priorKnowledge');
  const learnObjectives = isCreate
    ? ensureStringArray(input.learnObjectives, 'learnObjectives')
    : ensureOptionalStringArray(input.learnObjectives, 'learnObjectives');

  let topicId: number | undefined;

  if (isCreate) {
    if (typeof input.topicId !== 'number' || !Number.isInteger(input.topicId)) {
      throw new AuthoringError(400, 'topicId is required');
    }

    topicId = input.topicId;
  } else if (input.topicId !== undefined) {
    if (typeof input.topicId !== 'number' || !Number.isInteger(input.topicId)) {
      throw new AuthoringError(400, 'topicId must be an integer');
    }

    topicId = input.topicId;
  }

  if (topicId !== undefined) {
    await ensureTopicExists(topicId);
  }

  return {
    title,
    slug,
    description,
    stars,
    priorKnowledge,
    learnObjectives,
    topicId,
  };
};

export const mapModuleInput = (input: ModuleInput, isCreate: boolean) => {
  return {
    name: isCreate ? ensureString(input.name, 'name') : ensureOptionalString(input.name, 'name'),
    slug: isCreate ? ensureSlug(input.slug, 'slug') : ensureOptionalSlug(input.slug, 'slug'),
    description: isCreate ? ensureString(input.description, 'description') : ensureOptionalString(input.description, 'description'),
    order: isCreate ? ensurePositiveOrder(input.order, 'order') : ensureOptionalPositiveOrder(input.order, 'order'),
  };
};

export const mapLessonInput = (input: LessonInput, isCreate: boolean) => {
  return {
    name: isCreate ? ensureString(input.name, 'name') : ensureOptionalString(input.name, 'name'),
    slug: isCreate ? ensureSlug(input.slug, 'slug') : ensureOptionalSlug(input.slug, 'slug'),
    description: isCreate ? ensureString(input.description, 'description') : ensureOptionalString(input.description, 'description'),
    order: isCreate ? ensurePositiveOrder(input.order, 'order') : ensureOptionalPositiveOrder(input.order, 'order'),
  };
};

export const mapLessonContentInput = (input: LessonContentInput, isCreate: boolean) => {
  return {
    overview: input.overview === undefined ? undefined : input.overview,
    videoUrl: input.videoUrl === undefined ? undefined : input.videoUrl,
    body: isCreate ? ensureString(input.body, 'body') : ensureOptionalString(input.body, 'body'),
    resources: isCreate ? ensureStringArray(input.resources, 'resources') : ensureOptionalStringArray(input.resources, 'resources'),
    exerciseCount: isCreate
      ? ensureNonNegativeNumber(input.exerciseCount, 'exerciseCount')
      : ensureOptionalNonNegativeNumber(input.exerciseCount, 'exerciseCount'),
    durationMinutes: isCreate
      ? ensureNonNegativeNumber(input.durationMinutes, 'durationMinutes')
      : ensureOptionalNonNegativeNumber(input.durationMinutes, 'durationMinutes'),
  };
};
