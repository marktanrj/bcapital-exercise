'use client'

import { useEffect, useRef, useState } from "react";
import { Card } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { CornerRightUp } from "lucide-react";

const PLACEHOLDER_PROMPT = 'How can I help you?';
const MAX_HEIGHT = 300;

export default function Prompt() {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // resize height of textarea if there are more lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, MAX_HEIGHT);
      
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed!');
    }
  };

  return (
    <Card className="w-full grid grid-cols-[1fr_40px] p-5 md:w-[600px] border-[1.5px] shadow-xl">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={PLACEHOLDER_PROMPT}
        className="w-full resize-none border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none transition-height duration-200 !text-xl"
        style={{
          minHeight: '100px',
          maxHeight: `${MAX_HEIGHT}px`,
          overflow: value.length > 0 ? 'auto' : 'hidden',
        }}
      />
      {
        value.length ?
          <Button onKeyDown={handleKeyDown} className="h-11">
            <CornerRightUp className="w-4 h-11" />
          </Button> 
          : null
      }
    </Card>
  )
}
