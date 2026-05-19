const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type User = {
    id: string;
    name: string | null;
    email: string;
    role: 'STUDENT' | 'ADMIN';
    localStorageKey: string | null;
    createdAt: string;
    updatedAt: string;
}

export type createUserData = {
    name?: string;
    email: string;
    passwordHash: string;
    role?: 'STUDENT' | 'ADMIN';
    localStorageKey?: string;
}

//Used to update an User and turn all informations optional
export type updateUserType = Partial<createUserData>

//Its a blueprint of fetch data user.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers, 
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export function createUser(data: createUserData): Promise<User> {
    return request<User>('/users', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function getUsers(): Promise<User[]> {
    return request<User[]>('/users')
}

export function getUserById(id: string): Promise<User> {
    return request<User>(`/users/${id}`)
}

export function updateUser(id: string, data:updateUserType): Promise<User> {
    return request<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

//That function will not return nothing. just delete the user
export function deleteUser(id: string): Promise<void> {
    return request<void>(`/users/${id}`, {
        method: 'DELETE'
    })
}