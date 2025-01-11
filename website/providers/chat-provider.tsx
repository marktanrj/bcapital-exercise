'use client';

import { useChat } from "ai/react";
import { createContext, ReactNode, useContext, useState } from "react";
import { API_CONFIG } from "../api/config";

const ChatContext = createContext<ReturnType<typeof useChat> & 
  { chatId: string | null, setChatId: (chatId: string) => void } 
  | undefined>(undefined);

/**
 * to use same useChat hook in multiple components
 */
export function ChatProvider({ 
  children, 
}: { 
  children: ReactNode;
}) {
  const [chatId, setChatId] = useState<string | null>(null);

  const chat = useChat({
    streamProtocol: 'data',
    api: `${API_CONFIG.baseURL}/stream/chat`,
    body: {
      chatId,
    },
    credentials: 'include',
  });

  const value = {
    ...chat,
    setChatId,
    chatId
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatShared() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useSharedChat must be used within a ChatProvider');
  }
  return context;
}