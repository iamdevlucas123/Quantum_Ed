const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type createUserData = {
    name: string;
    email: string;
    passwordHash: string;
}

export async function createUser(data: createUserData) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error creating user');
    }
    return response.json();
}