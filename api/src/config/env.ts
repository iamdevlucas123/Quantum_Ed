import { config } from 'dotenv';

config();

const numberFromEnv = (value: string | undefined, fallback: number) => {
    const parsedValue = Number(value);

    return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

export const env = {
    PORT: numberFromEnv(process.env.PORT ?? process.env.PORT_API, 3000),
    DATABASE_URL: process.env.DATABASE_URL || '',
    POSTGRES_USER: process.env.POSTGRES_USER || '',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
    POSTGRES_DB: process.env.POSTGRES_DB || '',
    POSTGRES_PORT: numberFromEnv(process.env.POSTGRES_PORT, 5432),

    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',

    CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3001,http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    NODE_ENV: process.env.NODE_ENV || 'development',
}
