import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '../../../common';
import { failureChatResponses, suggestedQuestions } from '../../../../data/testFailureMockData';
import type { FailureChatMessage } from '../../../../hooks/useTestFailureDemo';

export function DeveloperChat() {
  const [messages, setMessages] = useState<FailureChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm Ordino. I've detected a critical bug (PROJ-1234) in the 2FA validation endpoint. I can help you understand the root cause, suggest fixes, and guide you through testing. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Check for keyword matches
    for (const [keyword, response] of Object.entries(failureChatResponses)) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        return response;
      }
    }

    // Default response if no match
    return `I can help you with:
- Root cause analysis
- Fix suggestions
- Testing guidance
- Impact assessment
- Deployment considerations

Try asking: "What is the root cause?" or "How do I fix this?"`;
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: FailureChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const response = findResponse(messageText);
      const assistantMessage: FailureChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ordino-primary/20 to-ordino-secondary/20 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(249, 115, 22, 0.2)',
              '0 0 20px 10px rgba(249, 115, 22, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Bot size={32} className="text-ordino-primary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">Chat with Ordino</h3>
        <p className="text-sm text-ordino-text-muted">
          Discuss the bug and get help with fixing it
        </p>
      </div>

      {/* Chat Container */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden">
          {/* Messages Area */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-ordino-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={16} className="text-ordino-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      message.role === 'user'
                        ? 'bg-ordino-primary text-white'
                        : 'bg-ordino-card border border-ordino-border'
                    }`}
                  >
                    <div
                      className={`text-sm whitespace-pre-wrap ${
                        message.role === 'user' ? 'text-white' : 'text-ordino-text'
                      }`}
                    >
                      {/* Render markdown-style content */}
                      {message.content.split('\n').map((line, idx) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <p key={idx} className="font-bold mt-2 first:mt-0">
                              {line.replace(/\*\*/g, '')}
                            </p>
                          );
                        }
                        if (line.startsWith('- ')) {
                          return (
                            <p key={idx} className="ml-2">
                              • {line.substring(2)}
                            </p>
                          );
                        }
                        if (line.startsWith('```')) {
                          return null; // Skip code block markers
                        }
                        if (line.startsWith('`') && line.endsWith('`')) {
                          return (
                            <p key={idx} className="font-mono text-xs bg-ordino-bg/50 px-2 py-1 rounded mt-1">
                              {line.replace(/`/g, '')}
                            </p>
                          );
                        }
                        return <p key={idx}>{line}</p>;
                      })}
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user'
                          ? 'text-white/70'
                          : 'text-ordino-text-muted'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-ordino-secondary/20 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-ordino-secondary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-ordino-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-ordino-primary" />
                </div>
                <div className="bg-ordino-card border border-ordino-border rounded-xl p-3">
                  <div className="flex items-center gap-1">
                    <motion.span
                      className="w-2 h-2 bg-ordino-primary rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-ordino-primary rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-ordino-primary rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-4 py-2 border-t border-ordino-border bg-ordino-card/50">
            <p className="text-xs text-ordino-text-muted mb-2 flex items-center gap-1">
              <MessageCircle size={12} />
              Suggested questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={isTyping}
                  className="px-3 py-1 text-xs bg-ordino-bg border border-ordino-border rounded-full hover:border-ordino-primary/50 hover:text-ordino-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-ordino-border bg-ordino-card">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the bug or fix..."
                disabled={isTyping}
                className="flex-1 px-4 py-2 bg-ordino-bg border border-ordino-border rounded-lg text-sm text-ordino-text placeholder:text-ordino-text-muted focus:outline-none focus:border-ordino-primary disabled:opacity-50"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
