export type UserRole = 'student' | 'admin';

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
