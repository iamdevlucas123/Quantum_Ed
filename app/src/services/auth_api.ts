import type {
  AuthResponse,
  AuthUserDto,
  JwtPayload,
  SignInData,
  SignUpData,
  UserRole,
} from '@quantum-ed/shared-types'

import { env } from '../config/env'

// Re-exported user type used by auth-related UI and store code.
export type AuthUser = AuthUserDto

// Re-exported role type used by auth forms.
export type AuthRole = UserRole

// Payload expected by the signup endpoint.
export type SignUpPayload = SignUpData

// Payload expected by the signin endpoint.
export type SignInPayload = SignInData

// Payload returned by access token verification.
export type TokenPayload = JwtPayload

// Shape of API error responses that include a public error message.
type ApiErrorResponse = {
  error?: string
}

// Sends an auth request with JSON headers and refresh-token cookies.
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

// Creates a new account and returns the authenticated session.
export function signUp(data: SignUpPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Authenticates an existing user and returns the authenticated session.
export function signIn(data: SignInPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Renews the session using the refresh token cookie.
export function refreshSession(): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/refresh', {
    method: 'POST',
  })
}

// Ends the session and clears the refresh token cookie on the API.
export function logout(): Promise<void> {
  return request<void>('/auth/logout', {
    method: 'POST',
  })
}

// Verifies an access token through the API.
export function verifyToken(accessToken: string): Promise<TokenPayload> {
  return request<TokenPayload>('/auth/verify', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
