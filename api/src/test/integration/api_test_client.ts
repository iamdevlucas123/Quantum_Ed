import request from 'supertest';
import app from '../../app';

export const api = request(app);

export const createApiAgent = () => request.agent(app);

export const authHeader = (accessToken: string) => `Bearer ${accessToken}`;
