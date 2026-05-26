import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import type { JwtPayload, SignInData, SignUpData } from '@quantum-ed/shared-types'
import { jwtConfig } from '../config/jwt'
import { prisma } from '../config/prisma'

type AuthUser = Omit<User, 'passwordHash'>

type AuthResponse = {
  user: AuthUser;
  accessToken: string;
}

const SALT_ROUNDS = 10

const sanitizeUser = (user: User): AuthUser => {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

const signAccessToken = (user: User): string => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  }

  const options: jwt.SignOptions = {
    expiresIn: jwtConfig.expiresIn,
  }

  return jwt.sign(payload, jwtConfig.secret, options)
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
    }
  },

  verifyAccessToken(token: string): JwtPayload {
    if (!jwtConfig.secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    return jwt.verify(token, jwtConfig.secret) as JwtPayload
  },
}
