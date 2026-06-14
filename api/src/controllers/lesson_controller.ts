import { Request, Response } from 'express';
import { lessonService } from '../services/lesson_service';

const getParam = (value: string | string[]): string => {
  return Array.isArray(value) ? value[0] : value;
};

export const lessonController = {
  async findByCourseAndLessonSlug(req: Request, res: Response): Promise<void> {
    try {
      const courseSlug = getParam(req.params.courseSlug);
      const lessonSlug = getParam(req.params.lessonSlug);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const lesson = await lessonService.findByCourseAndLessonSlug(courseSlug, lessonSlug, userId);

      if (!lesson) {
        res.status(404).json({ message: 'Lesson not found' });
        return;
      }

      res.status(200).json(lesson);
    } catch {
      res.status(500).json({ message: 'Error fetching lesson' });
    }
  },

  async updateProgress(req: Request, res: Response): Promise<void> {
    try {
      const courseSlug = getParam(req.params.courseSlug);
      const lessonSlug = getParam(req.params.lessonSlug);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { completed, progress } = req.body;
      const result = await lessonService.updateLessonProgress(courseSlug, lessonSlug, userId, {
        completed,
        progress,
      });

      if (!result) {
        res.status(404).json({ message: 'Lesson not found' });
        return;
      }

      res.status(200).json(result);
    } catch {
      res.status(500).json({ message: 'Error updating lesson progress' });
    }
  },
};
