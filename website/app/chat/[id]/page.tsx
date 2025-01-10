'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, messageApi, MessageRole } from '../../../api/message-api';
import { useChatStore } from '../../../store/chat-store';
import { api } from '../../../api/base-api';
import { useParams } from 'next/navigation';

export default function ChatWindow() {
  const params = useParams<{ id: string }>()
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const prompt = useChatStore((state) => state.prompt);
  const setPrompt = useChatStore((state) => state.setPrompt);
  const isNewPrompt = useChatStore((state) => state.isNewPrompt);
  const setIsNewPrompt = useChatStore((state) => state.setIsNewPrompt);

  useEffect(() => {
    // load existing messages if any
    const loadMessages = async () => {
      try {
        const data = await messageApi.getMessages(params.id);
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [params.id]);

  const connectToSSE = () => {
    const eventSource = new EventSource(
      `http://localhost:4000/stream/chat/${params.id}/events`,
      {
        withCredentials: true,
      }
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        setIsStreaming(false);
        eventSource.close();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMessages((prevMessages: any) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            // update the last message content
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + event.data },
            ];
          } else {
            // create a new assistant message
            return [
              ...prevMessages,
              {
                id: Date.now().toString(),
                content: event.data,
                role: 'assistant',
                createdAt: new Date().toISOString(),
              },
            ];
          }
        });
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
      setIsStreaming(false);
    };
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handlePrompt();
  };

  useEffect(() => {
    if (isNewPrompt && messages.length === 0) {
      handlePrompt();
      setIsNewPrompt(false);
    }
  }, [isNewPrompt]);

  const handlePrompt = async () => {
    if (!prompt.trim() || isStreaming) return;

    setIsStreaming(true);
    connectToSSE();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      role: MessageRole.USER,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await api.post(`/stream/chat/${params.id}/prompt`, {
        message: prompt,
      });

      console.log(response.data);

      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setIsStreaming(false);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'assistant' ? 'pl-4' : 'pl-0'
            }`}
          >
            <p className="font-semibold mb-1">
              {message.role === 'assistant' ? 'Assistant' : 'You'}
            </p>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isStreaming}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          disabled={isStreaming || !prompt.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {isStreaming ? 'Streaming...' : 'Send'}
        </button>
      </form>
    </div>
  );
}