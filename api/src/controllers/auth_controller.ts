import { Response, Request } from 'express'
import { authCookieConfig } from '../config/cookies'
import { authService } from '../services/auth_service'

const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie(authCookieConfig.refreshTokenName, refreshToken, authCookieConfig.refreshTokenOptions)
}

const getRefreshTokenCookie = (req: Request): string | undefined => {
  return req.cookies?.[authCookieConfig.refreshTokenName]
}

export const authController = {
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const {name, email, password, role} = req.body
      const result = await authService.signUp({
        name,
        email,
        password,
        role,
      })
      const {refreshToken, ...session} = result
      setRefreshTokenCookie(res, refreshToken)
      res.status(201).json(session)

    }catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error'
      res.status(400).json({ error: message })
    }
  },

  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
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

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization
      const [schema, token] = authHeader?.split('') ?? []

      if (schema !== 'Bearer' || !token) {
        res.status(401).json('Token not provided')
        return
      }

      const payload = authService.verifyAccessToken(token)
      res.status(200).json(payload)

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token'
      res.status(401).json({ error: message })
    }
  },

  async refreshSession(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = getRefreshTokenCookie(req)

      if(!refreshToken) {
        res.status(401).json({error: 'Refresh Token not provided'})
        return
      }

      const result = await authService.refreshSession(refreshToken)
      const { refreshToken: rotatedRefreshToken, ...session} = result
      
      setRefreshTokenCookie(res, rotatedRefreshToken)
      res.status(200).json(session)

    } catch (error) {
      res.clearCookie(authCookieConfig.refreshTokenName, authCookieConfig.clearRefreshTokenOptions)
      const message = error instanceof Error ? error.message : 'Invalid refresh token'
      res.status(401).json({ error: message })

    }
  },

  async logout(res: Response, req: Request): Promise<void> {
    try {
      const refreshToken = getRefreshTokenCookie(req)

      if (refreshToken) {
        await authService.logout(refreshToken)
      }

      res.clearCookie(authCookieConfig.refreshTokenName, authCookieConfig.refreshTokenOptions)
      res.status(204).send()

    } catch {
      res.clearCookie(authCookieConfig.refreshTokenName, authCookieConfig.clearRefreshTokenOptions)
      res.status(204).send()
    }
  }
}