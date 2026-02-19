import { motion } from 'framer-motion';
import { TeamsReportCard } from './TeamsReportCard';
import type { TeamsChannelMessage, TeamsReportData } from '../../../types';

interface TeamsMessageListProps {
  messages: TeamsChannelMessage[];
  reportData: TeamsReportData;
}

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const isBullet = line.startsWith('• ') || line.startsWith('* ');
    const content = isBullet ? line.slice(2) : line;

    const boldParts = content.split(/\*\*(.*?)\*\*/g);
    const rendered = boldParts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="font-semibold text-white">{part}</strong> : part
    );

    if (isBullet) {
      return (
        <div key={i} className="flex gap-2 leading-relaxed">
          <span className="text-white/50 flex-shrink-0">•</span>
          <span>{rendered}</span>
        </div>
      );
    }

    return (
      <span key={i}>
        {rendered}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function TeamsMessageList({ messages, reportData }: TeamsMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, idx) => {
        const isBot = msg.authorType === 'bot';

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-3"
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${
              isBot ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
            }`}>
              {isBot ? 'O' : msg.authorName.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-semibold ${isBot ? 'text-purple-300' : 'text-white'}`}>
                  {msg.authorName}
                </span>
                {isBot && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-medium">BOT</span>
                )}
                <span className="text-xs text-white/40">{msg.timestamp}</span>
              </div>

              {msg.isReport ? (
                <TeamsReportCard data={reportData} />
              ) : (
                <div className="text-sm text-white/85 leading-relaxed">
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
