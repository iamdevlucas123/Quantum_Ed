import express from 'express';
import cors from 'cors';
import { env } from './config/env';

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());


export default app;
