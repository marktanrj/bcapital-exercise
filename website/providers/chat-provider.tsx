'use client';

import { useChat } from "ai/react";
import { createContext, ReactNode, useContext, useState } from "react";

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
    api: `http://localhost:4000/stream/chat`,
    body: {
      chatId,
    },
    credentials: 'include',
    onResponse: (response) => {
      console.log('Stream response started:', response);
    },
    onFinish: (message) => {
      console.log('Stream finished:', message);
    },
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