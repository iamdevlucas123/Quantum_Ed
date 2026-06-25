import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const apiDir = path.resolve(dirname, '../../api')
const databaseUrl = process.env.DATABASE_URL ?? 'postgresql://quantum:quantum@localhost:5432/quantum_ed_test?schema=public'
const prismaClientPath = path.resolve(apiDir, 'node_modules/.prisma/client')

const run = (command: string): void => {
  const result = spawnSync(command, {
    cwd: apiDir,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      DATABASE_URL: databaseUrl,
      JWT_SECRET: process.env.JWT_SECRET ?? 'test-access-secret',
      ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ?? 'test-refresh-secret',
      REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
      FRONTEND_URL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
      CORS_ORIGINS: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    },
    shell: true,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    throw new Error(`E2E setup command failed: ${command}`)
  }
}

export default async function globalSetup(): Promise<void> {
  if (!databaseUrl.toLowerCase().includes('test')) {
    throw new Error('E2E DATABASE_URL must point to a database with "test" in its name')
  }

  if (process.env.CI || !fs.existsSync(prismaClientPath)) {
    run('npx prisma generate')
  }

  run('npx prisma migrate deploy')
  run('npm run import:courses:integration')
}
