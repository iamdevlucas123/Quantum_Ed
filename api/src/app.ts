import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { corsConfig } from './config/cors';
import { userRouter } from './routes/user_route'

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

app.use('/users', userRouter)


export default app;
