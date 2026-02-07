import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Play,
  Settings,
  History,
  MessageSquare,
} from 'lucide-react';
import { Logo } from '../common';
import { cn } from '../../utils/helpers';

interface SidebarProps {
  onChatToggle: () => void;
  isChatOpen: boolean;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/demo', icon: Play, label: 'Workflow Demo' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ onChatToggle, isChatOpen }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 bg-ordino-card border-r border-ordino-border flex flex-col z-40"
    >
      {/* Logo */}
      <div className="p-6 border-b border-ordino-border">
        <Logo size="md" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-ordino-primary/20 text-ordino-primary border border-ordino-primary/30'
                  : 'text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-card-hover'
              )
            }
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* AI Chat Toggle */}
      <div className="p-4 border-t border-ordino-border">
        <button
          onClick={onChatToggle}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all',
            isChatOpen
              ? 'bg-ordino-secondary/20 text-ordino-secondary border border-ordino-secondary/30'
              : 'text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-card-hover'
          )}
        >
          <MessageSquare size={20} />
          <span className="font-medium">AI Assistant</span>
          <span
            className={cn(
              'ml-auto w-2 h-2 rounded-full',
              isChatOpen ? 'bg-ordino-success' : 'bg-ordino-text-muted'
            )}
          />
        </button>
      </div>

      {/* Version */}
      <div className="p-4 text-center text-xs text-ordino-text-muted">
        Ordino AI v1.0.0 - Demo
      </div>
    </motion.aside>
  );
}
