import { Router } from 'express';
import { adminAuthoringController } from '../controllers/admin_authoring_controller';
import { requireAdmin } from '../middlewares/require_admin';

const adminAuthoringRouter = Router();

adminAuthoringRouter.use(requireAdmin);

adminAuthoringRouter.post('/courses', adminAuthoringController.createCourse);
adminAuthoringRouter.put('/courses/:courseId', adminAuthoringController.updateCourse);
adminAuthoringRouter.delete('/courses/:courseId', adminAuthoringController.deleteCourse);

adminAuthoringRouter.post('/courses/:courseId/modules', adminAuthoringController.createModule);
adminAuthoringRouter.put('/courses/:courseId/modules/reorder', adminAuthoringController.reorderModules);
adminAuthoringRouter.put('/modules/:moduleId', adminAuthoringController.updateModule);
adminAuthoringRouter.delete('/modules/:moduleId', adminAuthoringController.deleteModule);

adminAuthoringRouter.post('/modules/:moduleId/lessons', adminAuthoringController.createLesson);
adminAuthoringRouter.put('/modules/:moduleId/lessons/reorder', adminAuthoringController.reorderLessons);
adminAuthoringRouter.put('/lessons/:lessonId', adminAuthoringController.updateLesson);
adminAuthoringRouter.delete('/lessons/:lessonId', adminAuthoringController.deleteLesson);

adminAuthoringRouter.post('/lessons/:lessonId/content', adminAuthoringController.createLessonContent);
adminAuthoringRouter.put('/lessons/:lessonId/content', adminAuthoringController.updateLessonContent);
adminAuthoringRouter.delete('/lessons/:lessonId/content', adminAuthoringController.deleteLessonContent);

export { adminAuthoringRouter };
