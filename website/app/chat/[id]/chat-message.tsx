import { Message } from "ai/react";
import { Card } from "../../../components/ui/card";
import { cn } from "../../../lib/utils";

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
  lastMessageRef?: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessage({ message, isLastMessage, lastMessageRef }: ChatMessageProps) {
  return (
    <Card
      ref={isLastMessage ? lastMessageRef : null}
      className={cn('mb-4 p-5 shadow-md border-2', message.role === 'assistant' ? 'bg-slate-200' : 'bg-zinc-50')}
    >
      <p className="font-semibold mb-1">
        {message.role === 'assistant' ? 'Assistant' : 'You'}
      </p>
      <p className="whitespace-pre-wrap">{message.content}</p>
    </Card>
  );
}