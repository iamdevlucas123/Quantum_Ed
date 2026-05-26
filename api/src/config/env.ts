import { config } from 'dotenv';

config();

const numberFromEnv = (value: string | undefined, fallback: number) => {
    const parsedValue = Number(value);

    return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

const listFromEnv = (value: string | undefined, fallback: string): string[] => {
    const items = (value || fallback)
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    if (items.includes('*')) {
        throw new Error('CORS_ORIGINS cannot include "*" when credentials are enabled');
    }

    return items;
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
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '15m',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || '',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

    CORS_ORIGINS: listFromEnv(process.env.CORS_ORIGINS, 'http://localhost:3001,http://localhost:5173'),
    NODE_ENV: process.env.NODE_ENV || 'development',
}
