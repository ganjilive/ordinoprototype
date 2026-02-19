import { Hash, Bell, Lock, ChevronDown } from 'lucide-react';

const channels = [
  { name: 'general', type: 'public', unread: false },
  { name: 'qa-alerts', type: 'public', unread: true, active: true },
  { name: 'ci-cd', type: 'public', unread: false },
  { name: 'deployments', type: 'public', unread: false },
  { name: 'team-qa', type: 'private', unread: false },
];

export function SlackSidebar() {
  return (
    <div className="w-56 flex-shrink-0 bg-[#19172d] flex flex-col overflow-hidden">
      {/* Workspace header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-sm">Ordino QA</span>
          <ChevronDown size={14} className="text-white/60" />
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-xs text-white/60">You</span>
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="px-4 mb-2">
          <div className="flex items-center gap-1 text-xs text-white/50 font-semibold">
            <ChevronDown size={12} />
            <span>Channels</span>
          </div>
        </div>

        {channels.map(ch => (
          <div
            key={ch.name}
            className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer text-sm ${
              ch.active
                ? 'bg-white/20 text-white font-medium'
                : ch.unread
                ? 'text-white font-semibold'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {ch.type === 'private' ? (
              <Lock size={14} className="flex-shrink-0" />
            ) : (
              <Hash size={14} className="flex-shrink-0" />
            )}
            <span className="truncate">{ch.name}</span>
            {ch.unread && !ch.active && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0" />
            )}
          </div>
        ))}

        <div className="px-4 mt-4 mb-2">
          <div className="flex items-center gap-1 text-xs text-white/50 font-semibold">
            <ChevronDown size={12} />
            <span>Apps</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 text-sm text-white/60 hover:text-white cursor-pointer">
          <Bell size={14} />
          <span>Ordino Bot</span>
          <div className="ml-auto w-2 h-2 bg-ordino-primary rounded-full" />
        </div>
      </div>
    </div>
  );
}
