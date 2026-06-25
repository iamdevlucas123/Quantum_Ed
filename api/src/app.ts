import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { corsConfig } from './config/cors';
import { authRouter } from './routes/auth_route'
import { authMiddleware } from './middlewares/auth_middleware'
import { userRouter } from './routes/user_route'
import { protectedCourseRouter, publicCourseRouter } from './routes/course_route'
import { adminAuthoringRouter } from './routes/admin_authoring_route'
import { globalRateLimiter } from './middlewares/rate_limit'
import { publicRouter } from './routes/public_route'
import { publicStatsService } from './services/public_stats_service'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser())
app.use(globalRateLimiter)

if (env.NODE_ENV !== 'test') {
  void publicStatsService.start();
}

app.use('/auth', authRouter)
app.use('/public', publicRouter)
app.use('/courses', publicCourseRouter)
app.use(authMiddleware.requireAuth)
app.use('/users', userRouter)
app.use('/courses', protectedCourseRouter)
app.use('/admin', adminAuthoringRouter)


export default app;
