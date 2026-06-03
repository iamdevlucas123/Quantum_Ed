import { create } from 'zustand'
import type { AuthResponse } from '@quantum-ed/shared-types'
import * as authApi from '../services/auth_api'
import type { AuthUser, SignInPayload, SignUpPayload } from '../services/auth_api'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthActions = {
  signIn: (data: SignInPayload) => Promise<void>
  signUp: (data: SignUpPayload) => Promise<void>
  refreshSession: () => Promise<void>
  logout: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

let refreshSessionPromise: Promise<AuthResponse | null> | null = null

// Reuses an in-flight refresh request to avoid duplicate session refreshes.
const requestRefreshSession = (): Promise<AuthResponse | null> => {
  if (refreshSessionPromise !== null) {
    return refreshSessionPromise
  }

  refreshSessionPromise = authApi
    .refreshSession()
    .catch(() => null)
    .finally(() => {
      refreshSessionPromise = null
    })

  return refreshSessionPromise
}

// Builds the authenticated part of the store state from an API session.
const createAuthenticatedState = (session: AuthResponse): Pick<AuthState, 'user' | 'accessToken' | 'isAuthenticated'> => ({
  user: session.user,
  accessToken: session.accessToken,
  isAuthenticated: true,
})

const emptyAuthState: Pick<AuthState, 'user' | 'accessToken' | 'isAuthenticated'> = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...emptyAuthState,
  isLoading: true,

  signIn: async (data) => {
    // Signs in the user and stores the returned session.
    const session = await authApi.signIn(data)
    set(createAuthenticatedState(session))
  },

  signUp: async (data) => {
    // Creates a user account and stores the returned session.
    const session = await authApi.signUp(data)
    set(createAuthenticatedState(session))
  },

  refreshSession: async () => {
    // Restores the session using the refresh token cookie.
    set({ isLoading: true })

    const session = await requestRefreshSession()

    if (session) {
      set({
        ...createAuthenticatedState(session),
        isLoading: false,
      })
      return
    }

    set({
      ...emptyAuthState,
      isLoading: false,
    })
  },

  logout: async () => {
    // Logs out on the API and clears the local auth state.
    try {
      await authApi.logout()
    } finally {
      set(emptyAuthState)
    }
  },
}))

export const useAuth = useAuthStore
