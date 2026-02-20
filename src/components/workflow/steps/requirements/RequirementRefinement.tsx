import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';
import { Button, Badge } from '../../../common';

interface RequirementRefinementProps {
  onApprove: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const requirementChatResponses: Record<string, string> = {
  'incomplete|missing|clarify|what|unclear': 'The requirement is missing specific acceptance criteria. It mentions "secure 2FA" but doesn\'t specify: (1) Which authentication methods are supported? (2) What happens on timeout? (3) Error handling requirements? I need input from the BA and QA Lead to clarify these points.',
  'timeout|time|duration': 'Good question! The timeout duration should be specified. Industry standard is 30 seconds for SMS OTP and 5 minutes for email OTP. I\'ll add this to the refined requirement.',
  'methods|authentication|otp|sms|email': 'Based on the product backlog, we should support: (1) SMS OTP, (2) Email OTP, and (3) Authenticator app (TOTP). I\'ll add these methods to the acceptance criteria.',
  'error|failure|invalid': 'For error handling, we should specify: (1) Maximum retry attempts (3 attempts), (2) Account lockout behavior, (3) Error messages for each failure scenario. I\'ll include these in the refined requirement.',
  'ready|done|show|refined': 'I\'ve refined the requirement with input from the BA and QA Lead. Here\'s the updated version with complete acceptance criteria. Please review and approve.',
};

const suggestedPrompts = [
  'What is missing from the requirement?',
  'What should the timeout duration be?',
  'Show me the refined requirement',
];

export function RequirementRefinement({ onApprove }: RequirementRefinementProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `I've analyzed the requirement ORD-1234 and found it's incomplete. The acceptance criteria are too vague for effective test design. I'll collaborate with the BA and QA Lead to refine it. Ask me anything!`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRefinedRequirement, setShowRefinedRequirement] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const nextId = () => {
    idCounterRef.current += 1;
    return idCounterRef.current.toString();
  };

  const findResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    for (const [keywords, response] of Object.entries(requirementChatResponses)) {
      const keywordList = keywords.split('|');
      if (keywordList.some(keyword => lowerQuery.includes(keyword))) {
        // Show refined requirement if user asks for it
        if (keywords.includes('ready') || keywords.includes('show') || keywords.includes('refined')) {
          setTimeout(() => setShowRefinedRequirement(true), 1500);
          setTimeout(() => setShowApproval(true), 3000);
        }
        return response;
      }
    }

    return `I can help you understand:
- What's missing from the requirement
- Timeout specifications
- Supported authentication methods
- Error handling requirements

Try asking: "${suggestedPrompts[0]}"`;
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = findResponse(messageText);
      const assistantMessage: ChatMessage = {
        id: nextId(),
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

  return (
    <div className="space-y-6">
      {/* Chat Interface */}
      <div className="bg-ordino-card rounded-xl border border-ordino-border overflow-hidden">
        {/* Chat header */}
        <div className="bg-ordino-bg border-b border-ordino-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-ordino-primary" />
            <h3 className="text-sm font-semibold text-ordino-text">Collaboration Chat</h3>
            <Badge variant="info" size="sm">BA + QA Lead</Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-ordino-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-ordino-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-ordino-primary text-white'
                      : 'bg-ordino-bg border border-ordino-border text-ordino-text'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-ordino-secondary/20 flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-ordino-secondary" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-ordino-primary/20 flex items-center justify-center">
                <Bot size={16} className="text-ordino-primary" />
              </div>
              <div className="bg-ordino-bg border border-ordino-border rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-ordino-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-ordino-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-ordino-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 2 && (
          <div className="border-t border-ordino-border px-4 py-3">
            <p className="text-xs text-ordino-text-muted mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-ordino-bg border border-ordino-border hover:border-ordino-primary hover:text-ordino-primary transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-ordino-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the requirement..."
              className="flex-1 px-4 py-2 bg-ordino-bg border border-ordino-border rounded-lg text-ordino-text placeholder-ordino-text-muted focus:outline-none focus:border-ordino-primary"
            />
            <Button onClick={() => handleSend()} disabled={!inputValue.trim()}>
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Refined Requirement */}
      {showRefinedRequirement && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden"
        >
          {/* Jira-like header */}
          <div className="bg-green-600 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-green-600 font-bold text-xs">J</span>
              </div>
              <span className="text-white font-medium text-sm">ORD-1234</span>
              <Badge variant="success" size="sm">REFINED</Badge>
            </div>
            <ExternalLink size={16} className="text-white/70" />
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-ordino-text">
              Implement secure two-factor authentication (2FA) for user login
            </h3>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-ordino-primary mb-2">Summary</h4>
                <p className="text-sm text-ordino-text-muted">
                  Add two-factor authentication to the login flow to enhance account security. Users should be able to choose from multiple 2FA methods and manage their preferences.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-ordino-primary mb-2">Acceptance Criteria</h4>
                <ul className="space-y-2 text-sm text-ordino-text-muted">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span><strong>Supported Methods:</strong> SMS OTP, Email OTP, and Authenticator app (TOTP)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span><strong>Timeout Duration:</strong> SMS OTP valid for 30 seconds, Email OTP valid for 5 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span><strong>Error Handling:</strong> Maximum 3 retry attempts, account lockout after failures, specific error messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span><strong>User Experience:</strong> Clear instructions, fallback options if primary method fails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span><strong>Security:</strong> Rate limiting on OTP generation, encrypted storage of backup codes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Approval Section */}
      {showApproval && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-ordino-primary/10 to-ordino-success/5 rounded-xl border border-ordino-primary/30 p-6"
        >
          <div className="text-center mb-4">
            <CheckCircle size={48} className="text-ordino-success mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-ordino-text mb-2">
              Refined Requirement Ready for Approval
            </h3>
            <p className="text-sm text-ordino-text-muted">
              The requirement has been refined with complete acceptance criteria. Approve to proceed with test design.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="ghost" size="lg">
              Request Changes
            </Button>
            <Button onClick={onApprove} size="lg">
              <CheckCircle size={18} />
              Approve Requirement
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
