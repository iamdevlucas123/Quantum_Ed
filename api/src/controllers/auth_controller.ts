import { Response, Request } from 'express'
import { authCookieConfig } from '../config/cookies'
import { authService } from '../services/auth_service'

const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  // Uses the configured refresh token cookie name and options.
  res.cookie(authCookieConfig.refreshTokenName, refreshToken, authCookieConfig.refreshTokenOptions)
}

const getRefreshTokenCookie = (req: Request): string | undefined => {
  // Reads the refresh token from the configured cookie name.
  return req.cookies?.[authCookieConfig.refreshTokenName]
}

export const authController = {
  // Creates a new user and starts a session.
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body
      // Registers the user through the authentication service.
      const result = await authService.signUp({
        name,
        email,
        password,
        role,
      })
      const { refreshToken, ...session } = result
      setRefreshTokenCookie(res, refreshToken)
      res.status(201).json(session)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error'
      res.status(400).json({ error: message })
    }
  },

  // Authenticates the user and creates a session.
  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
      // Authenticates the credentials through the authentication service.
      const result = await authService.signIn({
        email,
        password,
      })
      const { refreshToken, ...session } = result
      setRefreshTokenCookie(res, refreshToken)
      res.status(200).json(session)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error'
      res.status(401).json({ error: message })
    }
  },

  // Validates the provided access token.
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization
      const [schema, token] = authHeader?.split('') ?? []

      if (schema !== 'Bearer' || !token) {
        res.status(401).json('Token not provided')
        return
      }

      // Verifies the access token through the authentication service.
      const payload = authService.verifyAccessToken(token)
      res.status(200).json(payload)

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token'
      res.status(401).json({ error: message })
    }
  },

  // Renews the session using the refresh token.
  async refreshSession(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = getRefreshTokenCookie(req)

      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh Token not provided' })
        return
      }

      // Refreshes the session through the authentication service.
      const result = await authService.refreshSession(refreshToken)
      const { refreshToken: rotatedRefreshToken, ...session } = result

      setRefreshTokenCookie(res, rotatedRefreshToken)
      res.status(200).json(session)
    } catch (error) {
      // Clears the refresh token cookie using the configured clear options.
      res.clearCookie(authCookieConfig.refreshTokenName, authCookieConfig.clearRefreshTokenOptions)
      const message = error instanceof Error ? error.message : 'Invalid refresh token'
      res.status(401).json({ error: message })
    }
  },

  // Ends the session and removes the cookie.
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = getRefreshTokenCookie(req)

      if (refreshToken) {
        // Invalidates the refresh token through the authentication service.
        await authService.logout(refreshToken)
      }

      // Clears the refresh token cookie using the configured clear options.
      res.clearCookie(authCookieConfig.refreshTokenName, authCookieConfig.clearRefreshTokenOptions)
      res.status(204).send()
    } catch {
      // Clears the refresh token cookie using the configured clear options.
      res.clearCookie(authCookieConfig.refreshTokenName, authCookieConfig.clearRefreshTokenOptions)
      res.status(204).send()
    }
  },
}
