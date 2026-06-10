import { Router } from 'express';
import { courseController } from '../controllers/course_controller';
import { lessonController } from '../controllers/lesson_controller';

const courseRouter = Router();

courseRouter.get('/', courseController.findAll);
courseRouter.get('/:courseSlug/lessons/:lessonSlug', lessonController.findByCourseAndLessonSlug);
courseRouter.get('/:slug', courseController.findBySlug);

export { courseRouter };
