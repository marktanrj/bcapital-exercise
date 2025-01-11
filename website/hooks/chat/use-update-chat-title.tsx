"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Chat, chatApi, UpdateChatTitleParams } from '../../api/chat-api';

export function useUpdateChatTitle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, data }: { chatId: string; data: UpdateChatTitleParams }) => 
      chatApi.updateChatTitle(chatId, data),
    onSuccess: (updatedChat) => {
      queryClient.setQueryData<Chat[]>(['chats', 'list'], (oldChats = []) => {
        return oldChats.map(chat => 
          chat.id === updatedChat.id ? updatedChat : chat
        );
      });
    },
  });
}