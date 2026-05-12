import 'dotenv/config';

export const env = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL || '',
    POSTGRES_USER: process.env.POSTGRES_USER || '',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
    POSTGRES_DB: process.env.POSTGRES_DB || '',
    POSTGRES_PORT: process.env.POSTGRES_PORT || '',

    PORT_JWT: process.env.PORT_JWT || 3232,
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',

    PORT_API: process.env.PORT_API,
    NODE_ENV: process.env.NODE_ENV,
}