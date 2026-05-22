import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth_service"; 

export const authMiddleware = {
  requireAuth(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization
      const [ scheme, token ] = authHeader?.split(' ') ?? [];

      if (scheme !== 'Bearer' || !token) {
        res.status(401).json({error: 'Token not provided'})
        return
      }

      const payload = authService.verifyAccessToken(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      } 

      next()

    } catch(error) {
      const message = error instanceof Error ? error.message : 'Invalid Token';
      res.status(401).json({error:message})
    }
  }
}