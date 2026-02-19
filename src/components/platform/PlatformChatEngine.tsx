import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { matchResponse } from '../../utils/platformChat';

export interface PlatformChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  authorName?: string;
}

interface PlatformChatEngineProps {
  responses: Record<string, string>;
  suggestedPrompts: string[];
  placeholder?: string;
  onSend: (message: string, response: string) => void;
  className?: string;
}

export function PlatformChatEngine({
  responses,
  suggestedPrompts,
  placeholder = 'Ask Ordino...',
  onSend,
  className,
}: PlatformChatEngineProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const response = matchResponse(trimmed, responses);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      onSend(trimmed, response);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Suggested prompts */}
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isTyping}
            className="px-3 py-1.5 text-xs bg-ordino-primary/10 text-ordino-primary border border-ordino-primary/20 rounded-full hover:bg-ordino-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isTyping}
          className="flex-1 bg-ordino-bg border border-ordino-border rounded-lg px-4 py-2.5 text-sm text-ordino-text placeholder:text-ordino-text-muted focus:outline-none focus:border-ordino-primary/50 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isTyping}
          className="px-4 py-2.5 bg-ordino-primary text-white rounded-lg hover:bg-ordino-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Typing indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-3 py-1"
          >
            <span className="text-xs text-ordino-text-muted">Ordino is typing</span>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-ordino-primary rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

