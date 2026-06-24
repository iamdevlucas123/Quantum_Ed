import type { User } from '@prisma/client';

export type AuthUser = Omit<User, 'passwordHash'>;

const EMAIL_SYNTAX_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/;

export const isValidEmailSyntax = (email: string): boolean => {
  return EMAIL_SYNTAX_REGEX.test(email);
};

export const meetsPasswordSecurityRequirements = (password: string): boolean => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return false;
  }

  if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
    return false;
  }

  if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
    return false;
  }

  if (!PASSWORD_SPECIAL_CHARACTER_REGEX.test(password)) {
    return false;
  }

  return true;
};

export const sanitizeUser = (user: User): AuthUser => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};
