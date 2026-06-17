export type UserRole = 'STUDENT' | 'ADMIN';

export type UserDto = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  localStorageKey: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserData = {
  name?: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  localStorageKey?: string;
}

export type UpdateUserData = Partial<CreateUserData>;

export type UpdateProfileData = {
  bio?: string | null;
  avatarUrl?: string | null;
}

export type SignUpData = {
  name?: string;
  email: string;
  password: string;
}

export type SignInData = {
  email: string;
  password: string;
}

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
}

export type AuthUserDto = UserDto;

export type AuthSessionResponse = {
  user: AuthUserDto;
  accessToken: string;
}

export type AuthResponse = AuthSessionResponse;

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
}
