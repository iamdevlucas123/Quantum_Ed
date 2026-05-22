import { Request, Response } from 'express'
import { authService } from '../services/auth_service'

export const authController = {
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body
      const result = await authService.signUp({
        name,
        email,
        password,
        role,
      })

      res.status(201).json(result)
    } catch (error) {
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

      res.status(200).json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error'
      res.status(401).json({ error: message })
    }
  },

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization
      const [scheme, token] = authHeader?.split(' ') ?? []

      if (scheme !== 'Bearer' || !token) {
        res.status(401).json({ error: 'Token not provided' })
        return
      }

      const payload = authService.verifyAccessToken(token)
      res.status(200).json(payload)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token'
      res.status(401).json({ error: message })
    }
  },
}
