import { Router } from 'express';
import { publicController } from '../controllers/public_controller';

const publicRouter = Router();

publicRouter.get('/stats', publicController.getStats);

export { publicRouter };
