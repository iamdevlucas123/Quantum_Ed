import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, UserRole } from '@prisma/client'
import { env } from '../config/env'
import { prisma } from '../config/prisma'

type signUp {
  name?: string;
  email: string;
  password: string;
  role: UserRole
}