import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { User } from '@prisma/client'
import type { JwtPayload, SignInData, SignUpData } from '@quantum-ed/shared-types'
import { authCookieConfig } from '../config/cookies'
import { jwtConfig } from '../config/jwt'
import { prisma } from '../config/prisma'

type AuthUser = Omit<User, 'passwordHash'>

type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

const SALT_ROUNDS = 10

const sanitizeUser = (user: User): AuthUser => {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

const signAccessToken = (user: User): string => {
  if (!jwtConfig.accessToken.secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  }
  const options: jwt.SignOptions = {
    expiresIn: jwtConfig.accessToken.expiresIn,
  }
  return jwt.sign(payload, jwtConfig.accessToken.secret, options)
}

const signRefreshToken = (user: User, tokenId: string): string => {
  if (!jwtConfig.refreshToken.secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not configured')
  }
  const payload: JwtPayload & { jti: string } = {
    sub: user.id,
    email: user.email,
    role: user.role,
    jti: tokenId,
  }
  const options: jwt.SignOptions = {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  }
  return jwt.sign(payload, jwtConfig.refreshToken.secret, options)
}


const createRefreshToken = async (user: User): Promise<string> => {
  const tokenId = randomUUID()
  const refreshToken = signRefreshToken(user, tokenId)
  const tokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS)
  const expiresAt = new Date(Date.now() + authCookieConfig.refreshTokenMaxAgeMs)
  await prisma.refreshToken.create({
    data: {
      id: tokenId,
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  })
  return refreshToken
}


export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingUser) {
      throw new Error('email already exist')
    }
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    })
    return {
      user: sanitizeUser(user),
      accessToken: signAccessToken(user),
      refreshToken: await createRefreshToken(user),
    }
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (!user) {
      throw new Error('Invalid credentials')
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }
    return {
      user: sanitizeUser(user),
      accessToken: signAccessToken(user),
      refreshToken: await createRefreshToken(user),
    } 
  },

  verifyAccessToken(token: string): JwtPayload {
    if (!jwtConfig.accessToken.secret) {
      throw new Error('JWT_SECRET is not configured')
    }
    return jwt.verify(token, jwtConfig.accessToken.secret) as JwtPayload
  },
}
