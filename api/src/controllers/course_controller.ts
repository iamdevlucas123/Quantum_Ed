import { Request, Response } from 'express';
import { courseService } from '../services/course_service';

const getParam = (value: string | string[]): string => {
  return Array.isArray(value) ? value[0] : value;
};

export const courseController = {
  async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const courses = await courseService.findAll();
      res.status(200).json(courses);
    } catch {
      res.status(500).json({ message: 'Error fetching courses' });
    }
  },

  async findBySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = getParam(req.params.slug);
      const course = await courseService.findBySlug(slug);

      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }

      res.status(200).json(course);
    } catch {
      res.status(500).json({ message: 'Error fetching course' });
    }
  },

  async findProtectedBySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = getParam(req.params.courseSlug);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const course = await courseService.findBySlugForUser(slug, userId);

      if (!course) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }

      res.status(200).json(course);
    } catch {
      res.status(500).json({ message: 'Error fetching course' });
    }
  },

  async save(req: Request, res: Response): Promise<void> {
    try {
      const courseSlug = getParam(req.params.courseSlug);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const result = await courseService.saveCourse(courseSlug, userId);

      if (!result) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }

      res.status(200).json(result);
    } catch {
      res.status(500).json({ message: 'Error saving course' });
    }
  },

  async unsave(req: Request, res: Response): Promise<void> {
    try {
      const courseSlug = getParam(req.params.courseSlug);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const result = await courseService.unsaveCourse(courseSlug, userId);

      if (!result) {
        res.status(404).json({ message: 'Course not found' });
        return;
      }

      res.status(200).json(result);
    } catch {
      res.status(500).json({ message: 'Error removing saved course' });
    }
  },
};
