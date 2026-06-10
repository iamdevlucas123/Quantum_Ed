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
      const lesson = await lessonService.findByCourseAndLessonSlug(courseSlug, lessonSlug);

      if (!lesson) {
        res.status(404).json({ message: 'Lesson not found' });
        return;
      }

      res.status(200).json(lesson);
    } catch {
      res.status(500).json({ message: 'Error fetching lesson' });
    }
  },
};
