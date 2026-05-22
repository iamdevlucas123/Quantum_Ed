import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, UserRole } from '@prisma/client'
import { jwtConfig } from '../config/jwt'
import { prisma } from '../config/prisma'

type SignUpData = {
  name?: string;
  email: string;
  password: string;
  role?: UserRole
}

type SignInData = {
  email: string;
  password: string;
}

type AuthUser = Omit<User, 'passwordHash'>

type AuthResponse = {
  user: AuthUser;
  accessToken: string;
}

type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole
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
