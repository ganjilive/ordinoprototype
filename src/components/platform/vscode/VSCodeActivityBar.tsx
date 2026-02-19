import { Files, Search, GitBranch, Bug, Package, Settings } from 'lucide-react';

interface VSCodeActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const icons = [
  { id: 'explorer', Icon: Files, title: 'Explorer' },
  { id: 'search', Icon: Search, title: 'Search' },
  { id: 'git', Icon: GitBranch, title: 'Source Control' },
  { id: 'debug', Icon: Bug, title: 'Run and Debug' },
  { id: 'extensions', Icon: Package, title: 'Extensions' },
];

export function VSCodeActivityBar({ activePanel, onPanelChange }: VSCodeActivityBarProps) {
  return (
    <div className="w-12 flex-shrink-0 bg-[#1e1e2e] border-r border-[#333344] flex flex-col items-center py-2">
      {icons.map(({ id, Icon, title }) => (
        <button
          key={id}
          title={title}
          onClick={() => onPanelChange(id)}
          className={`w-12 h-12 flex items-center justify-center transition-colors ${
            activePanel === id
              ? 'text-white border-l-2 border-white'
              : 'text-[#8888aa] hover:text-white'
          }`}
        >
          <Icon size={22} />
        </button>
      ))}
      <div className="flex-1" />
      <button className="w-12 h-12 flex items-center justify-center text-[#8888aa] hover:text-white">
        <Settings size={22} />
      </button>
    </div>
  );
}
