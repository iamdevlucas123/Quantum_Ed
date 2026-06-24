import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RequireAuth from './require_auth';

const authState = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
}));
const openLoginModal = vi.hoisted(() => vi.fn());

vi.mock('../context/auth_store', () => ({
  useAuth: () => authState,
}));

vi.mock('../context/ui_store', () => ({
  useUiStore: (selector: (state: { openLoginModal: () => void }) => () => void) => selector({ openLoginModal }),
}));

vi.mock('./loader', () => ({
  default: () => <div>Loading session</div>,
}));

const renderProtectedRoute = (initialEntry = '/profile?tab=activity#today') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<div>Protected profile</div>} />
        </Route>
        <Route path="/" element={<div>Home route</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('RequireAuth', () => {
  beforeEach(() => {
    authState.isAuthenticated = false;
    authState.isLoading = false;
    openLoginModal.mockClear();
  });

  it('renders a loader while auth is loading', () => {
    authState.isLoading = true;

    renderProtectedRoute();

    expect(screen.getByText('Loading session')).toBeInTheDocument();
  });

  it('redirects unauthenticated users and opens the login modal', async () => {
    renderProtectedRoute();

    expect(screen.getByText('Home route')).toBeInTheDocument();
    await waitFor(() => expect(openLoginModal).toHaveBeenCalledTimes(1));
  });

  it('renders protected content for authenticated users', () => {
    authState.isAuthenticated = true;

    renderProtectedRoute('/profile');

    expect(screen.getByText('Protected profile')).toBeInTheDocument();
    expect(openLoginModal).not.toHaveBeenCalled();
  });
});
