import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, UserRole } from '@prisma/client'
import { env } from '../config/env'
import { prisma } from '../config/prisma'

type SignUp = {
  name?: string;
  email: string;
  password: string;
  role: UserRole
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

//Its define how many times the bcrypt will process the password
const SALT_ROUNDS = 10

const sanitizeUser = (user: User): AuthUser => {
  const {passwordHash, ...safeUser} = user;
  return safeUser
}

//Its define the sign options
const signAccessToken = (user:User): string => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  }

  const options: jwt.SignOptions = {
    expiresIn: (env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'],
  }

  return jwt.sign(payload, env.JWT_EXPIRES_IN, options)
}

