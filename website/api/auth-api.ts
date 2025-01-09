import { UserData } from "../types/types";
import { api } from "./base-api";

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post<UserData>('/auth/login', { username, password });
    return response.data;
  },
  
  register: async (username: string, password: string) => {
    const response = await api.post<UserData>('/auth/register', { username, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  me: async () => {
    const response = await api.get('/me')
    return response.data;
  }
};
