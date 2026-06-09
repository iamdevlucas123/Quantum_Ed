import { Router } from 'express'
import { userController } from '../controllers/user_controller'

const userRouter = Router()

userRouter.post('/', userController.create);
userRouter.get('/', userController.findAll);
userRouter.get('/:id/progress', userController.findProgressByUserId);
userRouter.get('/:id', userController.findById);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

export { userRouter }
