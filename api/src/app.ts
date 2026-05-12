import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { corsConfig } from './config/cors';

const app = express();

app.use(cors(corsConfig));

app.use(express.json());


export default app;
