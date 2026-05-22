import jwt from 'jsonwebtoken'
import { env } from './env'

export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: (env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'],
}
