"use client"

import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../../api/chat-api';

export function useChats(limit?: number) {
  return useQuery({
    queryKey: ['chats', 'list', limit],
    queryFn: () => chatApi.getRecentChats({ limit }),
  });
}