import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Chat, chatApi } from '../../api/chat-api';

export function useDeleteChat() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (chatId: string) => chatApi.deleteChat(chatId),
    onSuccess: (_, deletedChatId) => {
      queryClient.setQueryData<Chat[]>(['chats', 'list'], (oldChats = []) => {
        return oldChats.filter(chat => chat.id !== deletedChatId);
      });
    },
  });
}