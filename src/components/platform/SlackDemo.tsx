import { useState, useRef } from 'react';
import { SlackSidebar } from './slack/SlackSidebar';
import { SlackMessageList } from './slack/SlackMessageList';
import { SlackMessageInput } from './slack/SlackMessageInput';
import { slackCIAlertData, slackInitialMessages, slackKeywordResponses, slackSuggestedPrompts } from '../../data/slackMockData';
import { matchResponse } from '../../utils/platformChat';
import type { SlackChannelMessage } from '../../types';

export function SlackDemoComponent() {
  const [messages, setMessages] = useState<SlackChannelMessage[]>(slackInitialMessages);
  const [isWaiting, setIsWaiting] = useState(false);
  const idCounterRef = useRef(0);
  const nextId = () => { idCounterRef.current += 1; return idCounterRef.current; };

  const handleSend = (text: string) => {
    if (isWaiting) return;

    // Add user message
    const userMsg: SlackChannelMessage = {
      id: `user-${nextId()}`,
      authorName: 'You',
      authorType: 'human',
      content: text,
      timestamp: 'Now',
    };
    setMessages(prev => [...prev, userMsg]);
    setIsWaiting(true);

    setTimeout(() => {
      const response = matchResponse(text, slackKeywordResponses);
      const botMsg: SlackChannelMessage = {
        id: `ordino-${nextId()}`,
        authorName: 'Ordino Bot',
        authorType: 'bot',
        content: response,
        timestamp: 'Now',
      };
      setMessages(prev => [...prev, botMsg]);
      setIsWaiting(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-[#1a1520] rounded-xl border border-ordino-border overflow-hidden">
      {/* Workspace sidebar */}
      <SlackSidebar />

      {/* Main channel area */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#1a1520]">
          <span className="text-white/60">#</span>
          <span className="font-semibold text-white text-sm">qa-alerts</span>
          <span className="text-white/30 mx-2">|</span>
          <span className="text-xs text-white/50">CI/CD alerts and test failure notifications</span>
        </div>

        {/* Messages */}
        <SlackMessageList messages={messages} alertData={slackCIAlertData} />

        {/* Input */}
        <SlackMessageInput
          channelName="qa-alerts"
          responses={slackKeywordResponses}
          suggestedPrompts={slackSuggestedPrompts}
          isWaiting={isWaiting}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
