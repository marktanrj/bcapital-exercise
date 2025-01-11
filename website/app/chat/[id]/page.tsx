'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useChatShared } from '../../../providers/chat-provider';
import { useGetMessages } from '../../../hooks/message/use-get-messages';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Textarea } from '../../../components/ui/textarea';
import { PLACEHOLDER_PROMPT } from '../../../constants/constants';
import { CornerRightUp } from 'lucide-react';
import { useChatScroll } from '../../../hooks/use-chat-scroll';
import { ChatMessage } from './chat-message';

export default function ChatWindow() {
  const params = useParams<{ id: string }>()
  const isInitialMount = useRef(true);

  const {
    setMessages,
    messages,
    input,
    setInput,
    handleSubmit,
    chatId,
    setChatId,
    isLoading,
  } = useChatShared();

  const { mutate: getMessages, isPending } = useGetMessages();
  const { messagesContainerRef, lastMessageRef } = useChatScroll({ messages });

  // reset chatId and remove messages
  useEffect(() => {
    if (params.id !== chatId) {
      setMessages([]);
      setChatId(params.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if user submits a new prompt from prompt page
  useEffect(() => {
    if (isInitialMount.current && input.length && chatId?.length) {
      handleSubmit();
      isInitialMount.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-4">
      <div 
        ref={messagesContainerRef}
        className="rounded-lg p-4 mb-4 overflow-y-auto h-full"
      >
        {isPending ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : (
          messages.map((message, index) => <ChatMessage
            key={message.id}
            message={message}
            isLastMessage={index === messages.length - 1}
            lastMessageRef={lastMessageRef} 
          />)
        )}
      </div>
      <div className='flex justify-center items-center h-36 sticky bottom-0'>
        <Card className='p-5 w-full h-full border-2 shadow-xl'>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={PLACEHOLDER_PROMPT}
              disabled={isLoading}
              className="w-full resize-none border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none transition-height duration-200 !text-xl"
              style={{
                minHeight: '100px',
                maxHeight: `200px`,
                overflow: input.length > 0 ? 'auto' : 'hidden',
              }}
            />
            <Button
              type="submit"
              disabled={isLoading && !input.trim()}
              className="h-11 px-4 py-2 text-white rounded disabled:bg-gray-400"
            >
              <CornerRightUp className="w-4 h-11" />
            </Button>
          </form>
        </Card>
      </div>  
    </div>
  );
}