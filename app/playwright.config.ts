import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const apiDir = path.resolve(dirname, '../api')
const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://quantum:quantum@localhost:5432/quantum_ed_test?schema=public'
const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:3000'
const appUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'
const apiPort = new URL(apiUrl).port || '3000'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  globalSetup: './e2e/global_setup.ts',
  use: {
    baseURL: appUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev',
      cwd: apiDir,
      url: `${apiUrl}/public/stats`,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: {
        ...process.env,
        NODE_ENV: 'test',
        PORT: apiPort,
        DATABASE_URL: databaseUrl,
        JWT_SECRET: process.env.JWT_SECRET ?? 'test-access-secret',
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? 'test-refresh-secret',
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
        FRONTEND_URL: appUrl,
        CORS_ORIGINS: appUrl,
      },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173',
      cwd: dirname,
      url: appUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: {
        ...process.env,
        VITE_API_URL: apiUrl,
      },
    },
  ],
})
