import { useState, useRef } from 'react';
import { TeamsSidebar } from './teams/TeamsSidebar';
import { TeamsMessageList } from './teams/TeamsMessageList';
import { TeamsMessageInput } from './teams/TeamsMessageInput';
import { teamsReportData, teamsInitialMessages, teamsKeywordResponses, teamsSuggestedPrompts } from '../../data/teamsMockData';
import { matchResponse } from '../../utils/platformChat';
import type { TeamsChannelMessage } from '../../types';

export function TeamsDemoComponent() {
  const [messages, setMessages] = useState<TeamsChannelMessage[]>(teamsInitialMessages);
  const [isWaiting, setIsWaiting] = useState(false);
  const idCounterRef = useRef(0);
  const nextId = () => { idCounterRef.current += 1; return idCounterRef.current; };

  const handleSend = (text: string) => {
    if (isWaiting) return;

    const userMsg: TeamsChannelMessage = {
      id: `user-${nextId()}`,
      authorName: 'You',
      authorType: 'human',
      content: text,
      timestamp: 'Just now',
    };
    setMessages(prev => [...prev, userMsg]);
    setIsWaiting(true);

    setTimeout(() => {
      const response = matchResponse(text, teamsKeywordResponses);
      const botMsg: TeamsChannelMessage = {
        id: `ordino-${nextId()}`,
        authorName: 'Ordino Bot',
        authorType: 'bot',
        content: response,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, botMsg]);
      setIsWaiting(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-[#1b1a30] rounded-xl border border-ordino-border overflow-hidden">
      {/* Sidebar */}
      <TeamsSidebar />

      {/* Main channel area */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#1b1a30]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-xs font-bold text-white">Q</div>
            <span className="font-semibold text-white text-sm">QA Team</span>
            <span className="text-white/30 mx-1">/</span>
            <span className="text-sm text-white/70">Test Results</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300">
              Ordino Bot active
            </div>
          </div>
        </div>

        {/* Messages */}
        <TeamsMessageList messages={messages} reportData={teamsReportData} />

        {/* Input */}
        <TeamsMessageInput
          suggestedPrompts={teamsSuggestedPrompts}
          isWaiting={isWaiting}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
