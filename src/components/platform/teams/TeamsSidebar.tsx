import { Users, MessageSquare, Calendar, ChevronDown, ChevronRight } from 'lucide-react';

const teams = [
  {
    name: 'QA Team',
    expanded: true,
    channels: [
      { name: 'General', active: false },
      { name: 'Test Results', active: true, unread: true },
      { name: 'Sprint Planning', active: false },
    ],
  },
  {
    name: 'Engineering',
    expanded: false,
    channels: [],
  },
];

export function TeamsSidebar() {
  return (
    <div className="w-56 flex-shrink-0 bg-[#201f3d] flex flex-col overflow-hidden">
      {/* App icons (top strip) */}
      <div className="flex flex-col items-center gap-4 py-4 px-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20">
          <MessageSquare size={16} className="text-white/70" />
        </div>
        <div className="w-8 h-8 rounded-lg bg-ordino-primary/20 flex items-center justify-center cursor-pointer">
          <Users size={16} className="text-ordino-primary" />
        </div>
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20">
          <Calendar size={16} className="text-white/70" />
        </div>
      </div>

      {/* Teams list */}
      <div className="flex-1 overflow-y-auto py-3">
        {teams.map(team => (
          <div key={team.name}>
            <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/10">
              {team.expanded ? (
                <ChevronDown size={12} className="text-white/50" />
              ) : (
                <ChevronRight size={12} className="text-white/50" />
              )}
              <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {team.name.charAt(0)}
              </div>
              <span className="text-sm text-white/80 font-medium truncate">{team.name}</span>
            </div>

            {team.expanded && team.channels.map(ch => (
              <div
                key={ch.name}
                className={`flex items-center gap-2 pl-9 pr-3 py-1.5 cursor-pointer text-sm ${
                  ch.active
                    ? 'bg-white/20 text-white font-medium'
                    : ch.unread
                    ? 'text-white font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-white/40">#</span>
                <span className="truncate">{ch.name}</span>
                {ch.unread && !ch.active && (
                  <div className="ml-auto w-2 h-2 bg-red-400 rounded-full" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
