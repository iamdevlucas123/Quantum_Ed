import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LoginModal from './login_modal';

const authActions = vi.hoisted(() => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock('../../context/auth_store', () => ({
  useAuth: () => authActions,
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('login=1&next=%2Fprofile'),
}));

const renderLoginModal = (onClose = vi.fn()) => {
  render(<LoginModal isOpen onClose={onClose} />);

  return { onClose };
};

describe('LoginModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(<LoginModal isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders login mode by default and switches to signup', async () => {
    const user = userEvent.setup();
    renderLoginModal();

    expect(screen.getByRole('dialog', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(screen.getByRole('dialog', { name: 'Create account' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument();
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
  });

  it('updates password strength feedback', async () => {
    const user = userEvent.setup();
    renderLoginModal();

    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    await user.type(screen.getByLabelText('Password'), 'Aa!12345');

    expect(screen.getByText('strong')).toBeInTheDocument();
  });

  it('submits signin and closes on success', async () => {
    const user = userEvent.setup();
    authActions.signIn.mockResolvedValue(undefined);
    const { onClose } = renderLoginModal();

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'Aa!12345');
    const loginButtons = screen.getAllByRole('button', { name: 'Log in' });
    await user.click(loginButtons[loginButtons.length - 1]);

    expect(authActions.signIn).toHaveBeenCalledWith({
      email: 'ada@example.com',
      password: 'Aa!12345',
    });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('submits signup and shows auth errors', async () => {
    const user = userEvent.setup();
    authActions.signUp.mockRejectedValue(new Error('Invalid email format'));
    renderLoginModal();

    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    await user.type(screen.getByLabelText('Name'), 'Ada');
    await user.type(screen.getByLabelText('Email'), 'invalid@example.com');
    await user.type(screen.getByLabelText('Password'), 'Aa!12345');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(authActions.signUp).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'invalid@example.com',
      password: 'Aa!12345',
    });
    expect(await screen.findByText('Invalid email format')).toBeInTheDocument();
  });
});
