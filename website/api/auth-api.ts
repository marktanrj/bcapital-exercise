import { api } from "./base-api";

export type UserData = {
  userId: string;
  username: string;
}

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post<UserData>('/auth/login', { username, password });
    return response.data;
  },
  
  signUp: async (username: string, password: string) => {
    const response = await api.post<UserData>('/auth/sign-up', { username, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  me: async () => {
    const response = await api.get<UserData>('/auth/me')
    return response.data;
  }
};
