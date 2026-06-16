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
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || '',

    CORS_ORIGINS: listFromEnv(
        process.env.CORS_ORIGINS,
        'http://localhost:3001,http://localhost:5173,http://127.0.0.1:3001,http://127.0.0.1:5173',
    ),
    NODE_ENV: process.env.NODE_ENV || 'development',
}
