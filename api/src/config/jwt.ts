import jwt from 'jsonwebtoken'
import { env } from './env'

export const jwtConfig = {
  accessToken: {
    secret: env.JWT_SECRET,
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  },
  refreshToken: {
    secret: env.REFRESH_TOKEN_SECRET,
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  },
  secret: env.JWT_SECRET,
  expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
}
