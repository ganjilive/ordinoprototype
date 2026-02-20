import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RefreshCw, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../common';
import { formatRelativeTime, cn } from '../../utils/helpers';
import type { ConnectedTool } from '../../types';

interface ConnectedToolsProps {
  tools: ConnectedTool[];
}

const statusColors = {
  connected: 'bg-ordino-success',
  disconnected: 'bg-ordino-text-muted',
  syncing: 'bg-ordino-warning',
};

const statusText = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  syncing: 'Syncing...',
};

export function ConnectedTools({ tools }: ConnectedToolsProps) {
  const activeTools = tools.filter((t) => t.status === 'connected' || t.status === 'syncing');
  const displayTools = activeTools.slice(0, 8);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Connected Tools</CardTitle>
        <span className="text-xs text-ordino-text-muted">{activeTools.length}/{tools.length} active</span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {displayTools.length === 0 ? (
            <p className="text-sm text-ordino-text-muted py-2">No active integrations. Connect tools in Settings.</p>
          ) : (
            displayTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 bg-ordino-bg rounded-lg hover:bg-ordino-card-hover transition-colors"
            >
              {/* Tool icon placeholder */}
              <div className="w-10 h-10 bg-ordino-card rounded-lg flex items-center justify-center text-ordino-text font-bold text-sm">
                {tool.name.charAt(0)}
              </div>

              {/* Tool info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ordino-text">{tool.name}</p>
                <p className="text-xs text-ordino-text-muted">
                  {tool.lastSync && `Last sync ${formatRelativeTime(tool.lastSync)}`}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {tool.status === 'syncing' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw size={14} className="text-ordino-warning" />
                  </motion.div>
                )}
                <div className="flex items-center gap-1.5">
                  <div className={cn('w-2 h-2 rounded-full', statusColors[tool.status])} />
                  <span className={cn(
                    'text-xs',
                    tool.status === 'connected' && 'text-ordino-success',
                    tool.status === 'disconnected' && 'text-ordino-text-muted',
                    tool.status === 'syncing' && 'text-ordino-warning'
                  )}>
                    {statusText[tool.status]}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
          )}
        </div>
        <Link
          to="/settings"
          className="mt-3 flex items-center justify-center gap-2 text-sm text-ordino-secondary hover:text-ordino-primary transition-colors"
        >
          <Settings size={14} />
          View all in Settings
        </Link>
      </CardContent>
    </Card>
  );
}
