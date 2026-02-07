import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { Logo } from '../common';
import { cn } from '../../utils/helpers';
import { sidebarVariants } from '../../utils/animations';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const samplePrompts = [
  "What's the current test coverage?",
  "Show me recent gaps",
  "Summarize today's activity",
  "Which tests are failing?",
];

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Ordino AI, your autonomous quality orchestrator. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        coverage: "Current test coverage is at 87.3%, up 2.1% from last week. The authentication module has the highest coverage at 94%, while the payment processing module needs attention at 72%.",
        gaps: "I've identified 3 gaps in the current test suite:\n\n1. Missing edge case tests for 2FA timeout scenarios\n2. No integration tests for the new webhook handler\n3. Performance tests needed for bulk user import feature",
        activity: "Today's activity summary:\n\n- 12 new test cases generated\n- 3 requirements analyzed\n- 2 gap reports created\n- 156 tests executed (98.7% pass rate)\n- 1 Slack notification sent to QA team",
        failing: "Currently, 2 tests are failing:\n\n1. `test_login_with_expired_token` - Assertion error on line 45\n2. `test_bulk_export_large_dataset` - Timeout after 30s\n\nWould you like me to analyze these failures?",
      };

      let response = "I understand you're asking about quality metrics. Could you be more specific? You can ask about test coverage, gaps, recent activity, or failing tests.";

      const lowerText = messageText.toLowerCase();
      if (lowerText.includes('coverage')) response = responses.coverage;
      else if (lowerText.includes('gap')) response = responses.gaps;
      else if (lowerText.includes('activity') || lowerText.includes('today') || lowerText.includes('summary')) response = responses.activity;
      else if (lowerText.includes('fail') || lowerText.includes('failing')) response = responses.failing;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[400px] bg-ordino-card border-l border-ordino-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-ordino-border">
              <div className="flex items-center gap-2">
                <Logo size="sm" showText={false} />
                <span className="font-semibold text-ordino-text">Ordino AI</span>
                <span className="w-2 h-2 bg-ordino-success rounded-full" />
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-card-hover transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-ordino-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={16} className="text-ordino-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap',
                      message.role === 'user'
                        ? 'bg-ordino-primary text-white'
                        : 'bg-ordino-bg text-ordino-text'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-ordino-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-ordino-primary" />
                  </div>
                  <div className="bg-ordino-bg p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-ordino-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-ordino-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-ordino-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sample Prompts */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-3 py-1.5 text-xs bg-ordino-bg border border-ordino-border rounded-full text-ordino-text-muted hover:text-ordino-text hover:border-ordino-primary transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-ordino-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Ordino anything..."
                  className="flex-1 px-4 py-2 bg-ordino-bg border border-ordino-border rounded-lg text-sm text-ordino-text placeholder:text-ordino-text-muted focus:outline-none focus:border-ordino-primary transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2 bg-ordino-primary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
