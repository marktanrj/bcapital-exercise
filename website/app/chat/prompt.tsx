'use client'

import { useEffect, useRef, useState } from "react";
import { Card } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { CornerRightUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateChat } from "../../hooks/chat/use-create-chat";
import { useChatShared } from "../../providers/chat-provider";
import { PLACEHOLDER_PROMPT } from "../../constants/constants";
import { motion } from "framer-motion";

const MotionCard = motion(Card);
const MotionTextarea = motion(Textarea);
const MAX_HEIGHT = 300;

export default function Prompt() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutateAsync: createChat } = useCreateChat();
  const { input, setInput } = useChatShared();

  // resize height of textarea if there are more lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, MAX_HEIGHT);
      
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newChat = await createChat({
        title: input.slice(0, 40),
      });

      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <MotionCard 
      layout
      layoutId="shared-textarea-card"
      className="w-full grid grid-cols-[1fr_40px] p-5 md:w-[600px] border-[1.5px] shadow-xl"
    >
      <MotionTextarea
        layout
        layoutId="shared-textarea"
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDER_PROMPT}
        disabled={isSubmitting}
        className="w-full resize-none border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none transition-height duration-200 !text-xl"
        style={{
          minHeight: '100px',
          maxHeight: `${MAX_HEIGHT}px`,
          overflow: input.length > 0 ? 'auto' : 'hidden',
        }}
      />
      {input.length > 0 && (
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="h-11"
        >
          <CornerRightUp className="w-4 h-11" />
        </Button>
      )}
    </MotionCard>
  );
}
