import { motion } from 'framer-motion';
import type { JiraComment } from '../../../types';

interface JiraActivitySectionProps {
  comments: JiraComment[];
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold
    const boldParts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = boldParts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="font-semibold text-ordino-text">{part}</strong> : part
    );
    // Inline code
    const withCode = rendered.flatMap((node, j) => {
      if (typeof node !== 'string') return [node];
      const codeParts = node.split(/`([^`]+)`/g);
      return codeParts.map((part, k) =>
        k % 2 === 1
          ? <code key={`${j}-${k}`} className="font-mono text-xs bg-ordino-bg px-1 py-0.5 rounded text-ordino-primary">{part}</code>
          : part
      );
    });
    return (
      <span key={i}>
        {withCode}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function JiraActivitySection({ comments }: JiraActivitySectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ordino-text mb-4">Activity</h3>
      <div className="space-y-4">
        {comments.map((comment, idx) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-3"
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
              comment.authorType === 'bot'
                ? 'bg-ordino-primary/20 text-ordino-primary'
                : 'bg-ordino-secondary/20 text-ordino-secondary'
            }`}>
              {comment.authorType === 'bot' ? 'O' : comment.authorName.charAt(0)}
            </div>

            {/* Comment body */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-ordino-text">{comment.authorName}</span>
                {comment.authorType === 'bot' && (
                  <span className="text-xs bg-ordino-primary/20 text-ordino-primary px-1.5 py-0.5 rounded">Bot</span>
                )}
                <span className="text-xs text-ordino-text-muted">{comment.timestamp}</span>
              </div>
              <div className="bg-ordino-bg border border-ordino-border rounded-lg p-3 text-sm text-ordino-text leading-relaxed">
                {parseMarkdown(comment.content)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
