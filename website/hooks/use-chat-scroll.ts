import { Message } from 'ai/react';
import { useEffect, useRef } from 'react';

interface UseChatScrollProps {
  messages: Message[];
  threshold?: number;
}

export function useChatScroll({ messages, threshold = 200 }: UseChatScrollProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shouldAutoScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.documentElement.scrollHeight - threshold;
      return scrollPosition >= scrollThreshold;
    };

    const scrollToBottom = () => {
      if (shouldAutoScroll() && lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    scrollToBottom();

    // Handle new messages and content changes
    const observer = new MutationObserver(scrollToBottom);
    if (messagesContainerRef.current) {
      observer.observe(messagesContainerRef.current, {
        childList: true,
        subtree: true
      });
    }

    return () => observer.disconnect();
  }, [messages, threshold]);

  return {
    messagesContainerRef,
    lastMessageRef,
  };
}