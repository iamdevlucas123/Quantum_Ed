const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { config } = require('dotenv');

config({ path: path.resolve(__dirname, '../src/config/.env'), quiet: true });
config({ quiet: true });

const DEFAULT_SOURCE = path.resolve(__dirname, '../../docs/courses/catalog');
const KEBAB_CASE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

class CourseImportValidationError extends Error {
  constructor(filePath, fieldPath, message) {
    super(`${filePath} :: ${fieldPath} :: ${message}`);
    this.name = 'CourseImportValidationError';
    this.filePath = filePath;
    this.fieldPath = fieldPath;
  }
}

const parseArgs = (argv) => {
  const options = {
    source: DEFAULT_SOURCE,
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    validateOnly: false,
    prune: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--source') {
      options.source = path.resolve(process.cwd(), argv[index + 1] ?? '');
      index += 1;
      continue;
    }

    if (arg.startsWith('--source=')) {
      options.source = path.resolve(process.cwd(), arg.slice('--source='.length));
      continue;
    }

    if (arg === '--mode') {
      options.mode = argv[index + 1] ?? options.mode;
      index += 1;
      continue;
    }

    if (arg.startsWith('--mode=')) {
      options.mode = arg.slice('--mode='.length);
      continue;
    }

    if (arg === '--validate-only') {
      options.validateOnly = true;
      continue;
    }

    if (arg === '--prune') {
      options.prune = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
};

const isPlainObject = (value) => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const fail = (filePath, fieldPath, message) => {
  throw new CourseImportValidationError(filePath, fieldPath, message);
};

const requireObject = (value, filePath, fieldPath) => {
  if (!isPlainObject(value)) {
    fail(filePath, fieldPath, 'must be an object');
  }
};

const requireString = (value, filePath, fieldPath) => {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(filePath, fieldPath, 'must be a non-empty string');
  }
};

const requireOptionalString = (value, filePath, fieldPath) => {
  if (value !== null && value !== undefined && typeof value !== 'string') {
    fail(filePath, fieldPath, 'must be a string or null');
  }
};

const requireInteger = (value, filePath, fieldPath, minValue) => {
  if (!Number.isInteger(value) || value < minValue) {
    fail(filePath, fieldPath, `must be an integer >= ${minValue}`);
  }
};

const requireStringArray = (value, filePath, fieldPath) => {
  if (!Array.isArray(value)) {
    fail(filePath, fieldPath, 'must be an array of strings');
  }

  value.forEach((item, index) => {
    if (typeof item !== 'string' || item.trim() === '') {
      fail(filePath, `${fieldPath}[${index}]`, 'must be a non-empty string');
    }
  });
};

const requireKebabCase = (value, filePath, fieldPath) => {
  requireString(value, filePath, fieldPath);

  if (!KEBAB_CASE_PATTERN.test(value)) {
    fail(filePath, fieldPath, 'must be kebab-case');
  }
};

const ensureUnique = (items, getValue, filePath, fieldPath) => {
  const seen = new Set();

  items.forEach((item, index) => {
    const value = getValue(item);

    if (seen.has(value)) {
      fail(filePath, `${fieldPath}[${index}]`, `duplicate value: ${value}`);
    }

    seen.add(value);
  });
};

const validateCourseEntry = (entry, filePath = '<memory>') => {
  requireObject(entry, filePath, '$');
  requireObject(entry.subject, filePath, 'subject');
  requireString(entry.subject.name, filePath, 'subject.name');
  requireString(entry.subject.description, filePath, 'subject.description');

  requireObject(entry.topic, filePath, 'topic');
  requireString(entry.topic.name, filePath, 'topic.name');
  requireString(entry.topic.description, filePath, 'topic.description');

  requireObject(entry.course, filePath, 'course');
  requireString(entry.course.title, filePath, 'course.title');
  requireKebabCase(entry.course.slug, filePath, 'course.slug');
  requireInteger(entry.course.stars, filePath, 'course.stars', 1);
  if (entry.course.stars > 5) {
    fail(filePath, 'course.stars', 'must be an integer between 1 and 5');
  }
  requireString(entry.course.description, filePath, 'course.description');
  requireStringArray(entry.course.priorKnowledge, filePath, 'course.priorKnowledge');
  requireStringArray(entry.course.learnObjectives, filePath, 'course.learnObjectives');

  if (!Array.isArray(entry.modules) || entry.modules.length === 0) {
    fail(filePath, 'modules', 'must be a non-empty array');
  }

  const moduleSlugs = new Set();

  entry.modules.forEach((module, moduleIndex) => {
    const modulePath = `modules[${moduleIndex}]`;

    requireObject(module, filePath, modulePath);
    requireString(module.name, filePath, `${modulePath}.name`);
    requireKebabCase(module.slug, filePath, `${modulePath}.slug`);
    if (moduleSlugs.has(module.slug)) {
      fail(filePath, `${modulePath}.slug`, `duplicate value: ${module.slug}`);
    }
    moduleSlugs.add(module.slug);
    requireString(module.description, filePath, `${modulePath}.description`);
    requireInteger(module.order, filePath, `${modulePath}.order`, 1);

    if (!Array.isArray(module.lessons) || module.lessons.length === 0) {
      fail(filePath, `${modulePath}.lessons`, 'must be a non-empty array');
    }

    const lessonSlugs = new Set();

    module.lessons.forEach((lesson, lessonIndex) => {
      const lessonPath = `${modulePath}.lessons[${lessonIndex}]`;

      requireObject(lesson, filePath, lessonPath);
      requireString(lesson.name, filePath, `${lessonPath}.name`);
      requireKebabCase(lesson.slug, filePath, `${lessonPath}.slug`);
      if (lessonSlugs.has(lesson.slug)) {
        fail(filePath, `${lessonPath}.slug`, `duplicate value: ${lesson.slug}`);
      }
      lessonSlugs.add(lesson.slug);
      requireString(lesson.description, filePath, `${lessonPath}.description`);
      requireInteger(lesson.order, filePath, `${lessonPath}.order`, 1);

      requireObject(lesson.content, filePath, `${lessonPath}.content`);
      requireOptionalString(lesson.content.overview, filePath, `${lessonPath}.content.overview`);
      requireOptionalString(lesson.content.videoUrl, filePath, `${lessonPath}.content.videoUrl`);
      requireString(lesson.content.body, filePath, `${lessonPath}.content.body`);
      requireStringArray(lesson.content.resources, filePath, `${lessonPath}.content.resources`);
      requireInteger(lesson.content.exerciseCount, filePath, `${lessonPath}.content.exerciseCount`, 0);
      requireInteger(lesson.content.durationMinutes, filePath, `${lessonPath}.content.durationMinutes`, 0);
    });
  });

  return entry;
};

const calculateCourseStats = (entry) => {
  const lessonsCount = entry.modules.reduce((total, module) => total + module.lessons.length, 0);
  const totalMinutes = entry.modules.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      return moduleTotal + lesson.content.durationMinutes;
    }, 0);
  }, 0);

  return {
    lessonsCount,
    hoursCount: Math.ceil(totalMinutes / 60),
  };
};

const listJsonFiles = (sourceDir) => {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Course source directory not found: ${sourceDir}`);
  }

  return fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(sourceDir, entry.name))
    .sort();
};

const readCourseFiles = (sourceDir) => {
  const entries = listJsonFiles(sourceDir).map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');

    try {
      return {
        filePath,
        entry: validateCourseEntry(JSON.parse(raw), filePath),
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new CourseImportValidationError(filePath, '$', error.message);
      }

      throw error;
    }
  });

  ensureUnique(
    entries.map(({ entry }) => entry),
    (entry) => entry.course.slug,
    sourceDir,
    'courses.slug',
  );

  return entries;
};

const findOrCreateSubject = async (prisma, subject) => {
  const existingSubject = await prisma.subject.findFirst({
    where: { name: subject.name },
  });

  if (existingSubject) {
    return prisma.subject.update({
      where: { id: existingSubject.id },
      data: { description: subject.description },
    });
  }

  return prisma.subject.create({ data: subject });
};

const findOrCreateTopic = async (prisma, topic, subjectId) => {
  const existingTopic = await prisma.topic.findFirst({
    where: {
      name: topic.name,
      subjectId,
    },
  });

  if (existingTopic) {
    return prisma.topic.update({
      where: { id: existingTopic.id },
      data: { description: topic.description },
    });
  }

  return prisma.topic.create({
    data: {
      ...topic,
      subjectId,
    },
  });
};

const upsertModule = async (prisma, courseId, module) => {
  const existingModule = await prisma.module.findFirst({
    where: {
      courseId,
      slug: module.slug,
    },
  });

  if (existingModule) {
    return prisma.module.update({
      where: { id: existingModule.id },
      data: {
        name: module.name,
        description: module.description,
        order: module.order,
      },
    });
  }

  return prisma.module.create({
    data: {
      courseId,
      name: module.name,
      slug: module.slug,
      description: module.description,
      order: module.order,
    },
  });
};

const upsertLesson = async (prisma, moduleId, lesson) => {
  const existingLesson = await prisma.lesson.findFirst({
    where: {
      moduleId,
      slug: lesson.slug,
    },
  });

  if (existingLesson) {
    return prisma.lesson.update({
      where: { id: existingLesson.id },
      data: {
        name: lesson.name,
        description: lesson.description,
        order: lesson.order,
      },
    });
  }

  return prisma.lesson.create({
    data: {
      moduleId,
      name: lesson.name,
      slug: lesson.slug,
      description: lesson.description,
      order: lesson.order,
    },
  });
};

const upsertLessonContent = async (prisma, lessonId, content) => {
  return prisma.lessonContent.upsert({
    where: { lessonId },
    update: {
      overview: content.overview ?? null,
      videoUrl: content.videoUrl ?? null,
      body: content.body,
      resources: content.resources,
      exerciseCount: content.exerciseCount,
      durationMinutes: content.durationMinutes,
    },
    create: {
      lessonId,
      overview: content.overview ?? null,
      videoUrl: content.videoUrl ?? null,
      body: content.body,
      resources: content.resources,
      exerciseCount: content.exerciseCount,
      durationMinutes: content.durationMinutes,
    },
  });
};

const importCourse = async (prisma, entry) => {
  const subject = await findOrCreateSubject(prisma, entry.subject);
  const topic = await findOrCreateTopic(prisma, entry.topic, subject.id);
  const stats = calculateCourseStats(entry);

  const course = await prisma.course.upsert({
    where: { slug: entry.course.slug },
    update: {
      title: entry.course.title,
      description: entry.course.description,
      stars: entry.course.stars,
      priorKnowledge: entry.course.priorKnowledge,
      learnObjectives: entry.course.learnObjectives,
      topicId: topic.id,
      lessonsCount: stats.lessonsCount,
      hoursCount: stats.hoursCount,
    },
    create: {
      ...entry.course,
      topicId: topic.id,
      lessonsCount: stats.lessonsCount,
      hoursCount: stats.hoursCount,
    },
  });

  for (const module of entry.modules) {
    const savedModule = await upsertModule(prisma, course.id, module);

    for (const lesson of module.lessons) {
      const savedLesson = await upsertLesson(prisma, savedModule.id, lesson);
      await upsertLessonContent(prisma, savedLesson.id, lesson.content);
    }
  }

  return course.slug;
};

const importCourses = async ({ source, validateOnly = false }) => {
  const courseFiles = readCourseFiles(source);

  if (validateOnly) {
    return courseFiles.map(({ entry }) => entry.course.slug);
  }

  const prisma = new PrismaClient();
  const importedSlugs = [];

  try {
    for (const { entry } of courseFiles) {
      importedSlugs.push(await importCourse(prisma, entry));
    }

    return importedSlugs;
  } finally {
    await prisma.$disconnect();
  }
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (options.prune) {
    throw new Error('--prune is not supported by this importer version');
  }

  const importedSlugs = await importCourses(options);
  const action = options.validateOnly ? 'Validated' : 'Imported';

  console.log(`${action} ${importedSlugs.length} courses from ${options.source}: ${importedSlugs.join(', ')}`);
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  CourseImportValidationError,
  calculateCourseStats,
  importCourse,
  importCourses,
  parseArgs,
  readCourseFiles,
  validateCourseEntry,
};
