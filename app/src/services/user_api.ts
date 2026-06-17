import type { CreateUserData, UpdateProfileData, UpdateUserData, UserDto } from '@quantum-ed/shared-types'

import { protectedRequest } from './http_client'

export type CreateUserPayload = CreateUserData
export type UpdateProfilePayload = UpdateProfileData
export type UpdateUserPayload = UpdateUserData
export type User = UserDto

export type UserCourseProgress = {
  id: string
  progress: number
  userId: string
  courseId: string
  createdAt: string
  updatedAt: string
  course: {
    id: string
    title: string
    slug: string
    stars: number
    description: string
    lessonsCount: number
    hoursCount: number
    topic?: {
      name: string
      subject?: {
        name: string
      }
    }
  }
}

export function createUser(data: CreateUserPayload): Promise<User> {
  return protectedRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getUsers(): Promise<User[]> {
  return protectedRequest<User[]>('/users')
}

export function getUserById(id: string): Promise<User> {
  return protectedRequest<User>(`/users/${id}`)
}

export function getUserProgress(id: string): Promise<UserCourseProgress[]> {
  return protectedRequest<UserCourseProgress[]>(`/users/${id}/progress`)
}

export function updateUser(id: string, data: UpdateUserPayload): Promise<User> {
  return protectedRequest<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function updateCurrentUserProfile(data: UpdateProfilePayload): Promise<User> {
  return protectedRequest<User>('/users/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteUser(id: string): Promise<void> {
  return protectedRequest<void>(`/users/${id}`, {
    method: 'DELETE',
  })
}
