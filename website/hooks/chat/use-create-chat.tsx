import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Chat, chatApi, CreateChatParams } from '../../api/chat-api';

export function useCreateChat() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateChatParams) => chatApi.createChat(data),
    onSuccess: (newChat) => {
      queryClient.setQueryData<Chat[]>(['chats', 'list'], (oldChats = []) => {
        return [newChat, ...oldChats];
      });
    },
  });
}