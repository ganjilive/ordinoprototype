import { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { matchResponse } from '../../../utils/platformChat';
import type { JiraComment } from '../../../types';

interface JiraCommentBoxProps {
  responses: Record<string, string>;
  suggestedPrompts: string[];
  onAddComment: (comment: JiraComment) => void;
}

export function JiraCommentBox({ responses, suggestedPrompts, onAddComment }: JiraCommentBoxProps) {
  const [input, setInput] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const idCounterRef = useRef(0);

  const nextId = () => {
    idCounterRef.current += 1;
    return idCounterRef.current;
  };

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isWaiting) return;

    setInput('');
    setIsWaiting(true);

    // Immediately add user comment
    const userComment: JiraComment = {
      id: `user-${nextId()}`,
      authorName: 'You',
      authorType: 'human',
      content: trimmed,
      timestamp: 'Just now',
    };
    onAddComment(userComment);

    // After 1500ms, add Ordino's response
    setTimeout(() => {
      const response = matchResponse(trimmed, responses);
      const botComment: JiraComment = {
        id: `ordino-${nextId()}`,
        authorName: 'Ordino Bot',
        authorType: 'bot',
        content: response,
        timestamp: 'Just now',
      };
      onAddComment(botComment);
      setIsWaiting(false);
    }, 1500);
  };

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-ordino-text mb-3">Add a comment</h4>

      {/* Suggested prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestedPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => submit(prompt)}
            disabled={isWaiting}
            className="px-3 py-1.5 text-xs bg-ordino-primary/10 text-ordino-primary border border-ordino-primary/20 rounded-full hover:bg-ordino-primary/20 transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit(input);
            }
          }}
          placeholder="Ask Ordino about this issue..."
          disabled={isWaiting}
          className="flex-1 bg-ordino-bg border border-ordino-border rounded-lg px-4 py-2.5 text-sm text-ordino-text placeholder:text-ordino-text-muted focus:outline-none focus:border-ordino-primary/50 disabled:opacity-50"
        />
        <button
          onClick={() => submit(input)}
          disabled={!input.trim() || isWaiting}
          className="px-4 py-2.5 bg-ordino-primary text-white rounded-lg hover:bg-ordino-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>

      {isWaiting && (
        <p className="text-xs text-ordino-text-muted mt-2 flex items-center gap-2">
          <span>Ordino is analyzing</span>
          <span className="inline-flex gap-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1 h-1 bg-ordino-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        </p>
      )}
    </div>
  );
}
