import { Message } from "ai/react";
import { api } from "./base-api";

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export const messageApi = {
  getMessages: async (chatId: string) => {
    const response = await api.get<Message[]>(`/messages/${chatId}`);
    return response.data;
  },
};
