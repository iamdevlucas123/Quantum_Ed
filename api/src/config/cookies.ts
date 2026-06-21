import type { CookieOptions } from 'express'
import { env } from './env'

const REFRESH_TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7

//Time required for Google to open and close the request and response when comparing states. Avoiding CSRF.
const OAUTH_STATE_MAX_AGE_MS = 1000 * 60 * 10

const baseRefreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
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
  oauthStateName: 'quantum_ed_oauth_state',
  oauthStateOptions: {
    ...baseRefreshTokenCookieOptions,
    maxAge: OAUTH_STATE_MAX_AGE_MS,
  },
  clearOAuthStateOptions: baseRefreshTokenCookieOptions,
} as const // transform the object in readonly
