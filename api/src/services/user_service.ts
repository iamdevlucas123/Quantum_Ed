import { User, UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';

type CreateUserData = {
  name?: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  localStorageKey?: string;
}

// That makes all the properties optional
type updateUserData = Partial<CreateUserData>

export const userService = {
  create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data })
  },

  findAll(): Promise<User[]>{
    return prisma.user.findMany()
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {id}
    })
  },

  findProgressByUserId(userId: string) {
    return prisma.progress.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            topic: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  },

  update(id: string, data: updateUserData): Promise<User> {
    return prisma.user.update({
      where: {id},
      data,
    })
  },

  delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: {id}
    })
  }
}
