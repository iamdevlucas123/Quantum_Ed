import { Router } from 'express'
import { authController } from '../controllers/auth_controller'
import { oauthController } from '../controllers/oauth_controller'
import { authRefreshRateLimiter, authSensitiveRateLimiter } from '../middlewares/rate_limit'

const authRouter = Router()

authRouter.post('/signup', authSensitiveRateLimiter, authController.signUp)
authRouter.post('/signin', authSensitiveRateLimiter, authController.signIn)
authRouter.post('/refresh', authRefreshRateLimiter, authController.refreshSession)
authRouter.post('/logout', authController.logout)
authRouter.get('/google', oauthController.startGoogleAuth)
authRouter.get('/google/callback', oauthController.completeGoogleAuth)
authRouter.get('/github', oauthController.startGithubAuth)
authRouter.get('/github/callback', oauthController.completeGithubAuth)
authRouter.get('/verify', authController.verifyToken)

export { authRouter }
