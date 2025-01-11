import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageApi } from '../../api/message-api';
import { Message } from 'ai/react';

export function useGetMessages() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (chatId: string) => messageApi.getMessages(chatId),
    onSuccess: (messages: Message[]) => {
      const formattedMessages = messages.map(message => ({
        id: message.id,
        role: message.role,
        content: message.content,
      }));
      
      queryClient.setQueryData(['messages'], formattedMessages);
    },
  });
}