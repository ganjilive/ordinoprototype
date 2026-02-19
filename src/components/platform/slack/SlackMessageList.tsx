import { motion } from 'framer-motion';
import { SlackCIAlertCard } from './SlackCIAlertCard';
import type { SlackChannelMessage, SlackCIAlertData } from '../../../types';

interface SlackMessageListProps {
  messages: SlackChannelMessage[];
  alertData: SlackCIAlertData;
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Check if it's a bullet line
    const isBullet = line.startsWith('• ') || line.startsWith('* ');
    const content = isBullet ? line.slice(2) : line;

    const boldParts = content.split(/\*\*(.*?)\*\*/g);
    const rendered = boldParts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="font-semibold text-white">{part}</strong> : part
    );
    const withCode = rendered.flatMap((node, j) => {
      if (typeof node !== 'string') return [node];
      const codeParts = node.split(/`([^`]+)`/g);
      return codeParts.map((part, k) =>
        k % 2 === 1
          ? <code key={`${j}-${k}`} className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded text-yellow-300">{part}</code>
          : part
      );
    });

    if (isBullet) {
      return (
        <div key={i} className="flex gap-2 leading-relaxed">
          <span className="text-white/50 flex-shrink-0">•</span>
          <span>{withCode}</span>
        </div>
      );
    }

    return (
      <span key={i}>
        {withCode}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function SlackMessageList({ messages, alertData }: SlackMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Date divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-white/10" />
        <span className="text-xs text-white/40">Today</span>
        <div className="flex-1 border-t border-white/10" />
      </div>

      {messages.map((msg, idx) => {
        const isSystem = msg.authorType === 'system';
        const isBot = msg.authorType === 'bot';

        if (isSystem) {
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <span className="text-xs text-white/40 italic">{msg.content}</span>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-3 group"
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold ${
              isBot ? 'bg-ordino-primary text-white' : 'bg-blue-500 text-white'
            }`}>
              {isBot ? 'O' : msg.authorName.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-bold ${isBot ? 'text-ordino-primary' : 'text-white'}`}>
                  {msg.authorName}
                </span>
                {isBot && (
                  <span className="text-xs bg-ordino-primary/20 text-ordino-primary px-1.5 py-0.5 rounded text-[10px] font-medium">APP</span>
                )}
                <span className="text-xs text-white/40">{msg.timestamp}</span>
              </div>

              {msg.isAlert ? (
                <SlackCIAlertCard data={alertData} />
              ) : (
                <div className="text-sm text-white/90 leading-relaxed">
                  {parseMarkdown(msg.content)}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
