import { Request, Response } from 'express';
import { authoringService } from '../services/authoring_service';
import { AuthoringError } from '../services/authoring_errors';

const getStringParam = (value: string | string[]): string => {
  return Array.isArray(value) ? value[0] : value;
};

const getNumberParam = (value: string | string[]): number => {
  const rawValue = getStringParam(value);
  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new AuthoringError(400, 'Invalid route parameter');
  }

  return parsedValue;
};

const handleError = (error: unknown, res: Response, fallbackMessage: string): void => {
  if (error instanceof AuthoringError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: fallbackMessage });
};

export const adminAuthoringController = {
  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const course = await authoringService.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      handleError(error, res, 'Error creating course');
    }
  },

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseId = getStringParam(req.params.courseId);
      const course = await authoringService.updateCourse(courseId, req.body);
      res.status(200).json(course);
    } catch (error) {
      handleError(error, res, 'Error updating course');
    }
  },

  async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseId = getStringParam(req.params.courseId);
      await authoringService.deleteCourse(courseId);
      res.status(204).send();
    } catch (error) {
      handleError(error, res, 'Error deleting course');
    }
  },

  async createModule(req: Request, res: Response): Promise<void> {
    try {
      const courseId = getStringParam(req.params.courseId);
      const module = await authoringService.createModule(courseId, req.body);
      res.status(201).json(module);
    } catch (error) {
      handleError(error, res, 'Error creating module');
    }
  },

  async updateModule(req: Request, res: Response): Promise<void> {
    try {
      const moduleId = getNumberParam(req.params.moduleId);
      const module = await authoringService.updateModule(moduleId, req.body);
      res.status(200).json(module);
    } catch (error) {
      handleError(error, res, 'Error updating module');
    }
  },

  async deleteModule(req: Request, res: Response): Promise<void> {
    try {
      const moduleId = getNumberParam(req.params.moduleId);
      await authoringService.deleteModule(moduleId);
      res.status(204).send();
    } catch (error) {
      handleError(error, res, 'Error deleting module');
    }
  },

  async reorderModules(req: Request, res: Response): Promise<void> {
    try {
      const courseId = getStringParam(req.params.courseId);
      await authoringService.reorderModules(courseId, req.body.items);
      res.status(200).json({ message: 'Modules reordered successfully' });
    } catch (error) {
      handleError(error, res, 'Error reordering modules');
    }
  },

  async createLesson(req: Request, res: Response): Promise<void> {
    try {
      const moduleId = getNumberParam(req.params.moduleId);
      const lesson = await authoringService.createLesson(moduleId, req.body);
      res.status(201).json(lesson);
    } catch (error) {
      handleError(error, res, 'Error creating lesson');
    }
  },

  async updateLesson(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = getNumberParam(req.params.lessonId);
      const lesson = await authoringService.updateLesson(lessonId, req.body);
      res.status(200).json(lesson);
    } catch (error) {
      handleError(error, res, 'Error updating lesson');
    }
  },

  async deleteLesson(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = getNumberParam(req.params.lessonId);
      await authoringService.deleteLesson(lessonId);
      res.status(204).send();
    } catch (error) {
      handleError(error, res, 'Error deleting lesson');
    }
  },

  async reorderLessons(req: Request, res: Response): Promise<void> {
    try {
      const moduleId = getNumberParam(req.params.moduleId);
      await authoringService.reorderLessons(moduleId, req.body.items);
      res.status(200).json({ message: 'Lessons reordered successfully' });
    } catch (error) {
      handleError(error, res, 'Error reordering lessons');
    }
  },

  async createLessonContent(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = getNumberParam(req.params.lessonId);
      const lessonContent = await authoringService.createLessonContent(lessonId, req.body);
      res.status(201).json(lessonContent);
    } catch (error) {
      handleError(error, res, 'Error creating lesson content');
    }
  },

  async updateLessonContent(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = getNumberParam(req.params.lessonId);
      const lessonContent = await authoringService.updateLessonContent(lessonId, req.body);
      res.status(200).json(lessonContent);
    } catch (error) {
      handleError(error, res, 'Error updating lesson content');
    }
  },

  async deleteLessonContent(req: Request, res: Response): Promise<void> {
    try {
      const lessonId = getNumberParam(req.params.lessonId);
      await authoringService.deleteLessonContent(lessonId);
      res.status(204).send();
    } catch (error) {
      handleError(error, res, 'Error deleting lesson content');
    }
  },
};
