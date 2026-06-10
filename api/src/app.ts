import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { corsConfig } from './config/cors';
import { authRouter } from './routes/auth_route'
import { authMiddleware } from './middlewares/auth_middleware'
import { userRouter } from './routes/user_route'
import { courseRouter } from './routes/course_route'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser())

app.use('/auth', authRouter)
app.use(authMiddleware.requireAuth)
app.use('/users', userRouter)
app.use('/courses', courseRouter)


export default app;
