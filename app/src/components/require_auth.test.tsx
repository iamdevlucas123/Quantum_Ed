import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RequireAuth from './require_auth';

const renderProtectedContent = () => render(<RequireAuth><div>Protected profile</div></RequireAuth>);

describe('RequireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders protected children', async () => {
    renderProtectedContent();

    await waitFor(() => expect(screen.getByText('Protected profile')).toBeInTheDocument());
  });
});
