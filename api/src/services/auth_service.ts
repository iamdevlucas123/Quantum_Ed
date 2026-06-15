import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, UserRole } from '@prisma/client'
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

type RefreshJwtPayload = JwtPayload & {
  jti: string;
}

const SALT_ROUNDS = 10
const EMAIL_SYNTAX_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isValidEmailSyntax = (email: string): boolean => {
  return EMAIL_SYNTAX_REGEX.test(email)
}

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

  return jwt.sign(payload, jwtConfig.accessToken.secret, {
    expiresIn: jwtConfig.accessToken.expiresIn,
  })
}

const signRefreshToken = (user: User, tokenId: string): string => {
  if (!jwtConfig.refreshToken.secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not configured')
  }

  const payload: RefreshJwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    jti: tokenId,
  }

  return jwt.sign(payload, jwtConfig.refreshToken.secret, {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  })
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

const verifyRefreshToken = (refreshToken: string): RefreshJwtPayload => {
  if (!jwtConfig.refreshToken.secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not configured')
  }

  const payload = jwt.verify(refreshToken, jwtConfig.refreshToken.secret) as RefreshJwtPayload

  if (!payload.jti) {
    throw new Error('Invalid refresh token')
  }

  return payload
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    if (!isValidEmailSyntax(data.email)) {
      throw new Error('Invalid email format')
    }

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
        role: UserRole.STUDENT,
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

  async refreshSession(refreshToken: string): Promise<AuthResponse> {
    const payload = verifyRefreshToken(refreshToken)

    const storedToken = await prisma.refreshToken.findUnique({
      where: { id: payload.jti },
      include: { user: true },
    })

    if (!storedToken || storedToken.userId !== payload.sub) {
      throw new Error('Invalid refresh token')
    }

    if (storedToken.revokedAt) {
      throw new Error('Refresh token was revoked')
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new Error('Refresh token expired')
    }

    const isTokenValid = await bcrypt.compare(refreshToken, storedToken.tokenHash)

    if (!isTokenValid) {
      throw new Error('Invalid refresh token')
    }

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    })

    return {
      user: sanitizeUser(storedToken.user),
      accessToken: signAccessToken(storedToken.user),
      refreshToken: await createRefreshToken(storedToken.user),
    }
  },

  async logout(refreshToken: string): Promise<void> {
    const payload = verifyRefreshToken(refreshToken)

    const storedToken = await prisma.refreshToken.findUnique({
      where: { id: payload.jti },
    })

    if (!storedToken || storedToken.userId !== payload.sub) {
      throw new Error('Invalid refresh token')
    }

    const isTokenValid = await bcrypt.compare(refreshToken, storedToken.tokenHash)

    if (!isTokenValid) {
      throw new Error('Invalid refresh token')
    }

    if (storedToken.revokedAt) {
      return
    }

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        revokedAt: new Date(),
      },
    })
  },

  verifyAccessToken(token: string): JwtPayload {
    if (!jwtConfig.accessToken.secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    return jwt.verify(token, jwtConfig.accessToken.secret) as JwtPayload
  },
}
