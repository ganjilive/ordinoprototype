import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 bg-ordino-card border-b border-ordino-border flex items-center justify-between px-6">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        key={title}
        className="text-xl font-semibold text-ordino-text"
      >
        {title}
      </motion.h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ordino-text-muted"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-ordino-bg border border-ordino-border rounded-lg text-sm text-ordino-text placeholder:text-ordino-text-muted focus:outline-none focus:border-ordino-primary transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-card-hover transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-ordino-primary rounded-full" />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-2 p-2 rounded-lg text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-card-hover transition-colors">
          <div className="w-8 h-8 bg-ordino-primary/20 rounded-full flex items-center justify-center">
            <User size={18} className="text-ordino-primary" />
          </div>
        </button>
      </div>
    </header>
  );
}
