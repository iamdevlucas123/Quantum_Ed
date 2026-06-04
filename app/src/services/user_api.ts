import type { CreateUserData, UpdateUserData, UserDto } from '@quantum-ed/shared-types'

import { protectedRequest } from './http_client'

export type CreateUserPayload = CreateUserData
export type UpdateUserPayload = UpdateUserData
export type User = UserDto

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

export function updateUser(id: string, data: UpdateUserPayload): Promise<User> {
  return protectedRequest<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteUser(id: string): Promise<void> {
  return protectedRequest<void>(`/users/${id}`, {
    method: 'DELETE',
  })
}
