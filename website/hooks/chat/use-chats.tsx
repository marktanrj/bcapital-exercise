"use client"

import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../../api/chat-api';

// to allow another component to invalidate the query
export const chatsQueryKey = ['chats', 'list'] as const;

export function useChats(limit?: number) {
  return useQuery({
    queryKey: [...chatsQueryKey, limit],
    queryFn: () => chatApi.getRecentChats({ limit }),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: 'always'
  });
}