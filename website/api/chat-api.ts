import { api } from "./base-api";

export type Chat = {
  id: string;
  title: string;
  lastActivityAt: Date;
  createdAt: Date;
}

export type GetChatsQueryParams = {
  limit?: number;
}

export type CreateChatParams = {
  title: string;
}

export type UpdateChatTitleParams = {
  title: string;
}

export const chatApi = {
  getRecentChats: async (params?: GetChatsQueryParams) => {
    const response = await api.get<Chat[]>('/chats', { params });
    return response.data;
  },
  createChat: async (data: CreateChatParams) => {
    const response = await api.post<Chat>('/chats', data);
    return response.data;
  },
  deleteChat: async (chatId: string) => {
    await api.delete(`/chats/${chatId}`);
  },
  updateChatTitle: async (chatId: string, data: UpdateChatTitleParams) => {
    const response = await api.patch<Chat>(`/chats/${chatId}/title`, data);
    return response.data;
  }
};