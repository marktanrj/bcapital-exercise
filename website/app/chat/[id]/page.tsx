'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useChatShared } from '../../../providers/chat-provider';
import { useGetMessages } from '../../../hooks/message/use-get-messages';

export default function ChatWindow() {
  const params = useParams<{ id: string }>()

  const { setMessages, messages, input, setInput, handleSubmit, chatId, setChatId } = useChatShared();
  const { mutate: getMessages, isPending } = useGetMessages();

  const isInitialMount = useRef(true);

  // reset chatId and remove messages
  useEffect(() => {
    if (params.id !== chatId) {
      setMessages([]);
      setChatId(params.id);
    }
  }, []);

  // if user submits a new prompt from prompt page
  useEffect(() => {
    if (isInitialMount.current && input.length) {
      handleSubmit();
    }
    isInitialMount.current = false;
  }, []);

  // populate old messages
  useEffect(() => {
    if (!chatId) return;
    getMessages(chatId, {
      onSuccess: (messages) => {
        setMessages(messages);
      },
    });
  }, [chatId, getMessages, setMessages]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="border rounded-lg p-4 mb-4 h-96 overflow-y-auto">
        {isPending ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : (
          messages.map((message) => (
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
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </div>
  );
}