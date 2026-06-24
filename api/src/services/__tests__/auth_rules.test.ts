import { describe, expect, it } from 'vitest';

import { isValidEmailSyntax, meetsPasswordSecurityRequirements, sanitizeUser } from '../auth_rules';

const createUser = () => ({
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
});

describe('auth rules', () => {
  it('validates email syntax', () => {
    expect(isValidEmailSyntax('learner@example.com')).toBe(true);
    expect(isValidEmailSyntax('learner.example.com')).toBe(false);
    expect(isValidEmailSyntax('learner@')).toBe(false);
    expect(isValidEmailSyntax('learner@example')).toBe(false);
  });

  it('validates password security requirements', () => {
    expect(meetsPasswordSecurityRequirements('Aa!12345')).toBe(true);
    expect(meetsPasswordSecurityRequirements('Aa!1234')).toBe(false);
    expect(meetsPasswordSecurityRequirements('AA!12345')).toBe(false);
    expect(meetsPasswordSecurityRequirements('aa!12345')).toBe(false);
    expect(meetsPasswordSecurityRequirements('Aa112345')).toBe(false);
  });

  it('removes passwordHash from sanitized users', () => {
    const sanitizedUser = sanitizeUser(createUser());

    expect(sanitizedUser).toMatchObject({
      id: 'user-1',
      email: 'ada@example.com',
      role: 'STUDENT',
    });
    expect('passwordHash' in sanitizedUser).toBe(false);
  });
});
