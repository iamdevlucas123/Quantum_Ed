import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: 'forks',
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1,
    env: {
      NODE_ENV: 'test',
      PORT: '3000',
      JWT_SECRET: 'test-access-secret',
      ACCESS_TOKEN_EXPIRES_IN: '15m',
      REFRESH_TOKEN_SECRET: 'test-refresh-secret',
      REFRESH_TOKEN_EXPIRES_IN: '7d',
      FRONTEND_URL: 'http://localhost:5173',
      CORS_ORIGINS: 'http://localhost:5173',
    },
  },
});
