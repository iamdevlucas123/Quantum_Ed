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
};
