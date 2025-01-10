import { api } from "./base-api";

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export const messageApi = {
  getMessages: async (chatId: string) => {
    const response = await api.get<Message[]>(`/messages/${chatId}/messages`);
    return response.data;
  },
};
