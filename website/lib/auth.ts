import { api } from "./base-api";

export async function loginUser(username: string, password: string) {
  const response = await api.post('/login', { username, password });
  return response.data;
}

export async function registerUser(username: string, password: string) {
  const response = await api.post('/register', { username, password });
  return response.data;
}

export async function getCurrentUser() {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    console.warn(error);
    return null;
  }
} 