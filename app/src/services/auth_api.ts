import type {
  AuthResponse,
  AuthUserDto,
  JwtPayload,
  SignInData,
  SignUpData,
  UserRole,
} from '@quantum-ed/shared-types'

import { env } from '../config/env'

export type AuthUser = AuthUserDto
export type AuthRole = UserRole
export type SignUpPayload = SignUpData
export type SignInPayload = SignInData
export type TokenPayload = JwtPayload

type ApiErrorResponse = {
  error?: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${env.API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const data = await response.json().catch((): ApiErrorResponse => ({}))
    throw new Error(data.error ?? `Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export function signUp(data: SignUpPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function signIn(data: SignInPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function refreshSession(): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/refresh', {
    method: 'POST',
  })
}

export function logout(): Promise<void> {
  return request<void>('/auth/logout', {
    method: 'POST',
  })
}

export function verifyToken(accessToken: string): Promise<TokenPayload> {
  return request<TokenPayload>('/auth/verify', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
