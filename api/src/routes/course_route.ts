import { Router } from 'express';
import { courseController } from '../controllers/course_controller';
import { lessonController } from '../controllers/lesson_controller';

const publicCourseRouter = Router();
const protectedCourseRouter = Router();

publicCourseRouter.get('/', courseController.findAll);
publicCourseRouter.get('/:slug', courseController.findBySlug);

protectedCourseRouter.get('/:courseSlug/detail', courseController.findProtectedBySlug);
protectedCourseRouter.put('/:courseSlug/save', courseController.save);
protectedCourseRouter.delete('/:courseSlug/save', courseController.unsave);
protectedCourseRouter.get('/:courseSlug/lessons/:lessonSlug', lessonController.findByCourseAndLessonSlug);
protectedCourseRouter.put('/:courseSlug/lessons/:lessonSlug/progress', lessonController.updateProgress);

export { publicCourseRouter, protectedCourseRouter };
