import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { prisma } from '../../config/prisma';
import { authService } from '../auth_service';

vi.mock('../../config/prisma', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../../config/jwt', () => ({
  jwtConfig: {
    accessToken: {
      secret: 'access-secret',
      expiresIn: '15m',
    },
    refreshToken: {
      secret: 'refresh-secret',
      expiresIn: '7d',
    },
  },
}));

vi.mock('../../config/cookies', () => ({
  authCookieConfig: {
    refreshTokenMaxAgeMs: 604800000,
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

const user = {
  id: 'user-1',
  name: 'Ada',
  email: 'ada@example.com',
  passwordHash: 'hashed-password',
  role: 'STUDENT' as const,
  localStorageKey: null,
  bio: null,
  avatarUrl: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
};

type PrismaMock = {
  user: {
    create: Mock;
    findUnique: Mock;
  };
  refreshToken: {
    create: Mock;
    findUnique: Mock;
    update: Mock;
  };
};

const mockedPrisma = prisma as unknown as PrismaMock;
const mockedBcrypt = vi.mocked(bcrypt);
const mockedJwt = vi.mocked(jwt);

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedBcrypt.hash.mockResolvedValue('hashed-value' as never);
    mockedBcrypt.compare.mockResolvedValue(true as never);
    mockedJwt.sign.mockReturnValueOnce('access-token' as never).mockReturnValueOnce('refresh-token' as never);
    mockedPrisma.refreshToken.create.mockResolvedValue({} as never);
  });

  it('rejects signup with invalid email before querying users', async () => {
    await expect(authService.signUp({
      email: 'invalid',
      password: 'Aa!12345',
    })).rejects.toThrow('Invalid email format');

    expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockedPrisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects signup with weak password before creating users', async () => {
    await expect(authService.signUp({
      email: 'ada@example.com',
      password: 'weak',
    })).rejects.toThrow('Password does not meet security requirements');

    expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockedPrisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects signup with duplicate email', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(user as never);

    await expect(authService.signUp({
      email: 'ada@example.com',
      password: 'Aa!12345',
    })).rejects.toThrow('email already exist');

    expect(mockedPrisma.user.create).not.toHaveBeenCalled();
  });

  it('creates students and returns a sanitized session on signup', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null as never);
    mockedPrisma.user.create.mockResolvedValue(user as never);

    const session = await authService.signUp({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'Aa!12345',
    });

    expect(mockedPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Ada',
        email: 'ada@example.com',
        passwordHash: 'hashed-value',
        role: 'STUDENT',
      },
    });
    expect(session.accessToken).toBe('access-token');
    expect(session.refreshToken).toBe('refresh-token');
    expect('passwordHash' in session.user).toBe(false);
  });

  it('rejects signin for missing users', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null as never);

    await expect(authService.signIn({
      email: 'ada@example.com',
      password: 'Aa!12345',
    })).rejects.toThrow('Invalid credentials');
  });

  it('rejects signin for users without local password', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ ...user, passwordHash: null } as never);

    await expect(authService.signIn({
      email: 'ada@example.com',
      password: 'Aa!12345',
    })).rejects.toThrow('Invalid credentials');
  });

  it('rejects signin with an incorrect password', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(user as never);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(authService.signIn({
      email: 'ada@example.com',
      password: 'Wrong!123',
    })).rejects.toThrow('Invalid credentials');
  });

  it('returns a sanitized session on valid signin', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(user as never);

    const session = await authService.signIn({
      email: 'ada@example.com',
      password: 'Aa!12345',
    });

    expect(session.accessToken).toBe('access-token');
    expect(session.refreshToken).toBe('refresh-token');
    expect('passwordHash' in session.user).toBe(false);
  });

  it('refreshes valid sessions and rotates refresh tokens', async () => {
    mockedJwt.verify.mockReturnValue({ sub: 'user-1', email: 'ada@example.com', role: 'STUDENT', jti: 'token-1' } as never);
    mockedPrisma.refreshToken.findUnique.mockResolvedValue({
      id: 'token-1',
      tokenHash: 'stored-hash',
      userId: 'user-1',
      revokedAt: null,
      expiresAt: new Date(Date.now() + 10000),
      user,
    } as never);
    mockedPrisma.refreshToken.update.mockResolvedValue({} as never);

    const session = await authService.refreshSession('refresh-token');

    expect(mockedPrisma.refreshToken.update).toHaveBeenCalledWith({
      where: { id: 'token-1' },
      data: { revokedAt: expect.any(Date) },
    });
    expect(session.accessToken).toBe('access-token');
    expect(session.refreshToken).toBe('refresh-token');
    expect('passwordHash' in session.user).toBe(false);
  });

  it('rejects refresh when stored token is missing, revoked, expired, or mismatched', async () => {
    mockedJwt.verify.mockReturnValue({ sub: 'user-1', email: 'ada@example.com', role: 'STUDENT', jti: 'token-1' } as never);
    mockedPrisma.refreshToken.findUnique.mockResolvedValueOnce(null as never);

    await expect(authService.refreshSession('refresh-token')).rejects.toThrow('Invalid refresh token');

    mockedPrisma.refreshToken.findUnique.mockResolvedValueOnce({
      id: 'token-1',
      tokenHash: 'stored-hash',
      userId: 'user-1',
      revokedAt: new Date(),
      expiresAt: new Date(Date.now() + 10000),
      user,
    } as never);

    await expect(authService.refreshSession('refresh-token')).rejects.toThrow('Refresh token was revoked');

    mockedPrisma.refreshToken.findUnique.mockResolvedValueOnce({
      id: 'token-1',
      tokenHash: 'stored-hash',
      userId: 'user-1',
      revokedAt: null,
      expiresAt: new Date(Date.now() - 10000),
      user,
    } as never);

    await expect(authService.refreshSession('refresh-token')).rejects.toThrow('Refresh token expired');

    mockedPrisma.refreshToken.findUnique.mockResolvedValueOnce({
      id: 'token-1',
      tokenHash: 'stored-hash',
      userId: 'user-1',
      revokedAt: null,
      expiresAt: new Date(Date.now() + 10000),
      user,
    } as never);
    mockedBcrypt.compare.mockResolvedValueOnce(false as never);

    await expect(authService.refreshSession('refresh-token')).rejects.toThrow('Invalid refresh token');
  });

  it('revokes valid refresh tokens on logout', async () => {
    mockedJwt.verify.mockReturnValue({ sub: 'user-1', email: 'ada@example.com', role: 'STUDENT', jti: 'token-1' } as never);
    mockedPrisma.refreshToken.findUnique.mockResolvedValue({
      id: 'token-1',
      tokenHash: 'stored-hash',
      userId: 'user-1',
      revokedAt: null,
    } as never);
    mockedPrisma.refreshToken.update.mockResolvedValue({} as never);

    await authService.logout('refresh-token');

    expect(mockedPrisma.refreshToken.update).toHaveBeenCalledWith({
      where: { id: 'token-1' },
      data: { revokedAt: expect.any(Date) },
    });
  });

  it('does not revoke tokens that are already revoked on logout', async () => {
    mockedJwt.verify.mockReturnValue({ sub: 'user-1', email: 'ada@example.com', role: 'STUDENT', jti: 'token-1' } as never);
    mockedPrisma.refreshToken.findUnique.mockResolvedValue({
      id: 'token-1',
      tokenHash: 'stored-hash',
      userId: 'user-1',
      revokedAt: new Date(),
    } as never);

    await authService.logout('refresh-token');

    expect(mockedPrisma.refreshToken.update).not.toHaveBeenCalled();
  });

  it('verifies access tokens', () => {
    const payload = { sub: 'user-1', email: 'ada@example.com', role: 'STUDENT' };
    mockedJwt.verify.mockReturnValue(payload as never);

    expect(authService.verifyAccessToken('access-token')).toEqual(payload);
  });
});
