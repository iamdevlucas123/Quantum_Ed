import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthResponse } from '@quantum-ed/shared-types';
import * as authApi from '../services/auth_api';
import { useAuthStore } from './auth_store';

vi.mock('../services/auth_api', () => ({
  logout: vi.fn(),
  refreshSession: vi.fn(),
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

const user = {
  id: 'user-1',
  name: 'Ada',
  email: 'ada@example.com',
  role: 'STUDENT' as const,
  localStorageKey: null,
  bio: null,
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

const session: AuthResponse = {
  user,
  accessToken: 'access-token',
};

const mockedAuthApi = vi.mocked(authApi);

describe('auth store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it('starts loading without an authenticated session', () => {
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it('stores signin sessions', async () => {
    mockedAuthApi.signIn.mockResolvedValue(session);

    await useAuthStore.getState().signIn({ email: 'ada@example.com', password: 'Aa!12345' });

    expect(useAuthStore.getState()).toMatchObject({
      user,
      accessToken: 'access-token',
      isAuthenticated: true,
    });
  });

  it('stores signup sessions', async () => {
    mockedAuthApi.signUp.mockResolvedValue(session);

    await useAuthStore.getState().signUp({ email: 'ada@example.com', password: 'Aa!12345' });

    expect(useAuthStore.getState()).toMatchObject({
      user,
      accessToken: 'access-token',
      isAuthenticated: true,
    });
  });

  it('refreshes a valid session', async () => {
    mockedAuthApi.refreshSession.mockResolvedValue(session);

    await useAuthStore.getState().refreshSession();

    expect(useAuthStore.getState()).toMatchObject({
      user,
      accessToken: 'access-token',
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('clears state when refresh fails', async () => {
    mockedAuthApi.refreshSession.mockRejectedValue(new Error('expired'));

    await useAuthStore.getState().refreshSession();

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('clears local state directly and after failed logout', async () => {
    useAuthStore.getState().updateUser(user);
    useAuthStore.setState({ accessToken: 'token' });

    useAuthStore.getState().clearSession();
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });

    useAuthStore.setState({ user, accessToken: 'token', isAuthenticated: true, isLoading: false });
    mockedAuthApi.logout.mockRejectedValue(new Error('network'));

    await expect(useAuthStore.getState().logout()).rejects.toThrow('network');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('reuses an in-flight refresh request', async () => {
    let resolveSession: (value: AuthResponse) => void = () => undefined;
    mockedAuthApi.refreshSession.mockReturnValue(new Promise((resolve) => {
      resolveSession = resolve;
    }));

    const firstRefresh = useAuthStore.getState().refreshSession();
    const secondRefresh = useAuthStore.getState().refreshSession();
    resolveSession(session);

    await Promise.all([firstRefresh, secondRefresh]);

    expect(mockedAuthApi.refreshSession).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
