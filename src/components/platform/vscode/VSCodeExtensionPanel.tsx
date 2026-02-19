import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, TrendingUp, AlertCircle } from 'lucide-react';
import type { VSCodeCoverage } from '../../../types';
import { matchResponse } from '../../../utils/platformChat';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface VSCodeExtensionPanelProps {
  coverage: VSCodeCoverage;
  responses: Record<string, string>;
  suggestedPrompts: string[];
}

function parseContent(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const isBullet = line.startsWith('• ') || line.startsWith('* ');
    const isNumbered = /^\d+\.\s/.test(line);
    const isCode = line.startsWith('```') || line.endsWith('```');

    if (isCode) return null;

    const content = isBullet ? line.slice(2) : isNumbered ? line : line;
    const boldParts = content.split(/\*\*(.*?)\*\*/g);
    const rendered = boldParts.map((part, j) =>
      j % 2 === 1
        ? <strong key={j} className="font-semibold text-white">{part}</strong>
        : part
    );
    const withCode = rendered.flatMap((node, j) => {
      if (typeof node !== 'string') return [node];
      const codeParts = node.split(/`([^`]+)`/g);
      return codeParts.map((part, k) =>
        k % 2 === 1
          ? <code key={`${j}-${k}`} className="font-mono text-[10px] bg-white/10 px-1 rounded text-green-300">{part}</code>
          : part
      );
    });

    if (isBullet || isNumbered) {
      return (
        <div key={i} className="flex gap-1.5 leading-relaxed">
          <span className="text-white/40 flex-shrink-0 mt-0.5">{isBullet ? '•' : line.match(/^\d+/)?.[0] + '.'}</span>
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

export function VSCodeExtensionPanel({ coverage, responses, suggestedPrompts }: VSCodeExtensionPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const idCounterRef = useRef(0);
  const nextId = () => { idCounterRef.current += 1; return idCounterRef.current; };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setInput('');
    setMessages(prev => [...prev, { id: `u-${nextId()}`, role: 'user', content: trimmed }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = matchResponse(trimmed, responses);
      setMessages(prev => [...prev, { id: `a-${nextId()}`, role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="w-80 flex-shrink-0 bg-[#1e1e2e] border-l border-[#333344] flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#333344] bg-[#252535]">
        <div className="w-5 h-5 rounded bg-ordino-primary/30 flex items-center justify-center">
          <span className="text-ordino-primary text-[10px] font-bold">O</span>
        </div>
        <span className="text-xs font-semibold text-white">Ordino Coverage</span>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
      </div>

      {/* Coverage summary */}
      <div className="p-3 border-b border-[#333344] bg-[#1a1a2e]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#8888aa]">auth.test.ts</span>
          <div className="flex items-center gap-1">
            <AlertCircle size={11} className="text-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">{coverage.overall}%</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {[
            { label: 'Statements', value: coverage.overall, color: 'bg-yellow-500' },
            { label: 'Functions', value: coverage.functions, color: 'bg-orange-500' },
            { label: 'Branches', value: coverage.branches, color: 'bg-red-500' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-[10px] text-[#8888aa] mb-0.5">
                <span>{label}</span>
                <span className={value < 70 ? 'text-orange-400' : 'text-green-400'}>{value}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#333344]">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={10} className="text-red-400" />
            <span className="text-[10px] text-[#8888aa] font-medium">Uncovered ({coverage.uncoveredFunctions.length})</span>
          </div>
          {coverage.uncoveredFunctions.map(fn => (
            <div key={fn.name} className="flex items-center gap-2 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <code className="text-[10px] text-red-300 font-mono truncate">{fn.name}</code>
              <span className="text-[10px] text-[#8888aa] flex-shrink-0">L{fn.startLine}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-4">
            <p className="text-[10px] text-[#8888aa]">Ask Ordino about coverage</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-full rounded-lg px-3 py-2 text-[11px] leading-relaxed ${
              msg.role === 'user'
                ? 'bg-ordino-primary/20 text-white border border-ordino-primary/30'
                : 'bg-white/5 text-[#cccccc] border border-white/10'
            }`}>
              {msg.role === 'assistant' ? parseContent(msg.content) : msg.content}
            </div>
          </div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-3 py-2"
            >
              <span className="text-[10px] text-[#8888aa]">Ordino</span>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-ordino-primary rounded-full"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested prompts */}
      <div className="px-3 pb-2 flex flex-wrap gap-1.5">
        {suggestedPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isTyping}
            className="px-2 py-1 text-[10px] bg-ordino-primary/10 text-ordino-primary border border-ordino-primary/20 rounded hover:bg-ordino-primary/20 transition-colors disabled:opacity-50 leading-tight"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#333344] flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend(input);
            }
          }}
          placeholder="Ask about coverage..."
          disabled={isTyping}
          className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-[11px] text-white placeholder:text-[#8888aa] focus:outline-none focus:border-ordino-primary/50 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isTyping}
          className="w-8 h-8 bg-ordino-primary rounded flex items-center justify-center hover:bg-ordino-primary/80 transition-colors disabled:opacity-40 flex-shrink-0"
        >
          <Send size={13} className="text-white" />
        </button>
      </div>
    </div>
  );
}
