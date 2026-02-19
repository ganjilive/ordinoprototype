import { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

interface SlackMessageInputProps {
  channelName: string;
  responses: Record<string, string>;
  suggestedPrompts: string[];
  isWaiting: boolean;
  onSend: (text: string) => void;
}

export function SlackMessageInput({
  channelName,
  suggestedPrompts,
  isWaiting,
  onSend,
}: SlackMessageInputProps) {
  const [input, setInput] = useState('');

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isWaiting) return;
    setInput('');
    onSend(trimmed);
  };

  return (
    <div className="p-4 border-t border-white/10">
      {/* Suggested prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestedPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isWaiting}
            className="px-3 py-1.5 text-xs bg-white/10 text-white/70 border border-white/20 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white/10 rounded-lg border border-white/20 p-2">
        <div className="flex items-center gap-2">
          <Paperclip size={16} className="text-white/40 flex-shrink-0" />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder={`Message #${channelName}`}
            disabled={isWaiting}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50"
          />
          <Smile size={16} className="text-white/40 flex-shrink-0" />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isWaiting}
            className="w-7 h-7 bg-ordino-primary rounded flex items-center justify-center hover:bg-ordino-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>

      {isWaiting && (
        <p className="text-xs text-white/40 mt-2 flex items-center gap-2">
          <span>Ordino Bot is typing</span>
          <span className="inline-flex gap-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1 h-1 bg-white/40 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        </p>
      )}
    </div>
  );
}
