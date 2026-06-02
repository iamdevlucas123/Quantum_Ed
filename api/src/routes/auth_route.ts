import { Router } from 'express'
import { authController } from '../controllers/auth_controller'

const authRouter = Router()

authRouter.post('/signup', authController.signUp)
authRouter.post('/signin', authController.signIn)
authRouter.post('/refresh', authController.refreshSession)
authRouter.post('/logout', authController.logout)
authRouter.get('/verify', authController.verifyToken)

export { authRouter }
