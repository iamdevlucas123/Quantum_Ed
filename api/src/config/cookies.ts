import type { CookieOptions } from 'express'
import { env } from './env'

const REFRESH_TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7

const baseRefreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/auth',
} satisfies CookieOptions // turn the type more strict

export const authCookieConfig = {
  refreshTokenName: 'quantum_ed_refresh_token',
  refreshTokenMaxAgeMs: REFRESH_TOKEN_MAX_AGE_MS,
  refreshTokenOptions: {
    ...baseRefreshTokenCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  },
  clearRefreshTokenOptions: baseRefreshTokenCookieOptions,
} as const // transform the object in readonly
