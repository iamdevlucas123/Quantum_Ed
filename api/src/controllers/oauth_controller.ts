import { Request, Response } from 'express'
import { authCookieConfig } from '../config/cookies'
import { env } from '../config/env'
import { authService } from '../services/auth_service'
import { oauthService } from '../services/oauth_service'

const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie(authCookieConfig.refreshTokenName, refreshToken, authCookieConfig.refreshTokenOptions)
}

const getSafeNextPath = (value: unknown): string => {
  if (typeof value !== 'string' || !value.startsWith('/')) {
    return '/'
  }

  return value
}

const setOAuthStateCookie = (
  res: Response,
  provider: 'google' | 'github',
  state: string,
  nextPath: string,
): void => {
  const cookieValue = JSON.stringify({
    provider,
    state,
    nextPath,
  })

  res.cookie(authCookieConfig.oauthStateName, cookieValue, authCookieConfig.oauthStateOptions)
}

const getOAuthStateCookie = (
  req: Request,
): { provider: 'google' | 'github'; state: string; nextPath: string } | null => {
  const rawCookie = req.cookies?.[authCookieConfig.oauthStateName]

  if (!rawCookie || typeof rawCookie !== 'string') {
    return null
  }

  try {
    const parsedCookie = JSON.parse(rawCookie) as {
      provider?: 'google' | 'github'
      state?: string
      nextPath?: string
    }

    if (!parsedCookie.provider || !parsedCookie.state) {
      return null
    }

    return {
      provider: parsedCookie.provider,
      state: parsedCookie.state,
      nextPath: getSafeNextPath(parsedCookie.nextPath),
    }
  } catch {
    return null
  }
}

const clearOAuthStateCookie = (res: Response): void => {
  res.clearCookie(authCookieConfig.oauthStateName, authCookieConfig.clearOAuthStateOptions)
}

const redirectToFrontend = (res: Response, path: string): void => {
  res.redirect(new URL(path, env.FRONTEND_URL).toString())
}

const redirectToOAuthError = (res: Response, message: string, nextPath: string): void => {
  const params = new URLSearchParams({
    login: '1',
    oauth_error: message,
  })

  if (nextPath !== '/') {
    params.set('next', nextPath)
  }

  redirectToFrontend(res, `/?${params.toString()}`)
}

const beginOAuthFlow = (provider: 'google' | 'github', req: Request, res: Response): void => {
  const state = oauthService.createState()
  const nextPath = getSafeNextPath(req.query.next)

  setOAuthStateCookie(res, provider, state, nextPath)
  res.redirect(oauthService.getAuthorizationUrl(provider, state))
}

const completeOAuthFlow = async (
  provider: 'google' | 'github',
  req: Request,
  res: Response,
): Promise<void> => {
  const code = typeof req.query.code === 'string' ? req.query.code : ''
  const state = typeof req.query.state === 'string' ? req.query.state : ''
  const storedState = getOAuthStateCookie(req)

  clearOAuthStateCookie(res)

  if (!code || !state || !storedState || storedState.provider !== provider || storedState.state !== state) {
    redirectToOAuthError(res, 'Invalid OAuth state', storedState?.nextPath ?? '/')
    return
  }

  try {
    const user = await oauthService.authenticate(provider, code)
    const session = await authService.createSessionForUser(user)
    const { refreshToken } = session

    setRefreshTokenCookie(res, refreshToken)
    redirectToFrontend(res, storedState.nextPath)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OAuth authentication failed'
    redirectToOAuthError(res, message, storedState.nextPath)
  }
}

export const oauthController = {
  startGoogleAuth(req: Request, res: Response): void {
    try {
      beginOAuthFlow('google', req, res)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google OAuth is unavailable'
      redirectToOAuthError(res, message, getSafeNextPath(req.query.next))
    }
  },

  async completeGoogleAuth(req: Request, res: Response): Promise<void> {
    await completeOAuthFlow('google', req, res)
  },

  startGithubAuth(req: Request, res: Response): void {
    try {
      beginOAuthFlow('github', req, res)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'GitHub OAuth is unavailable'
      redirectToOAuthError(res, message, getSafeNextPath(req.query.next))
    }
  },

  async completeGithubAuth(req: Request, res: Response): Promise<void> {
    await completeOAuthFlow('github', req, res)
  },
}
