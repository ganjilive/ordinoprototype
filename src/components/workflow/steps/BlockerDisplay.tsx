import { motion } from 'framer-motion';
import { AlertCircle, User, CheckCircle, MessageSquare } from 'lucide-react';
import { Button, Badge } from '../../common';
import { useState, useEffect } from 'react';
import { escalationChain, communicationLog } from '../../../data/mockData';
import type { Blocker } from '../../../types';

interface BlockerDisplayProps {
  blocker: Blocker;
  onResolve: (blockerId: string) => void;
  onEscalate?: () => void;
}

function formatTimeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export function BlockerDisplay({ blocker, onResolve, onEscalate }: BlockerDisplayProps) {
  const [timeBlocked, setTimeBlocked] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeBlocked(formatTimeSince(blocker.createdAt));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [blocker.createdAt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="border-2 border-ordino-error rounded-xl overflow-hidden animate-pulse"
      style={{ animationDuration: '2s' }}
    >
      {/* Alert Banner */}
      <div className="bg-ordino-error/10 border-l-4 border-ordino-error p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle className="text-ordino-error" size={28} />
            </motion.div>
            <div>
              <h3 className="font-bold text-ordino-error text-lg">Workflow Blocked</h3>
              <p className="text-sm text-ordino-text-muted">Blocker ID: {blocker.id}</p>
            </div>
          </div>
          <Badge variant="error" size="sm">{blocker.type}</Badge>
        </div>

        {/* Blocker Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-ordino-card p-3 rounded-lg">
            <p className="text-xs text-ordino-text-muted mb-1">Description</p>
            <p className="text-sm text-ordino-text">{blocker.description}</p>
          </div>
          <div className="bg-ordino-card p-3 rounded-lg">
            <p className="text-xs text-ordino-text-muted mb-1">Impact</p>
            <p className="text-sm text-ordino-text">{blocker.impact}</p>
          </div>
          <div className="bg-ordino-card p-3 rounded-lg">
            <p className="text-xs text-ordino-text-muted mb-1">Time Blocked</p>
            <p className="text-sm text-ordino-error font-bold">{timeBlocked}</p>
          </div>
          <div className="bg-ordino-card p-3 rounded-lg">
            <p className="text-xs text-ordino-text-muted mb-1">Est. Resolution</p>
            <p className="text-sm text-ordino-text">{blocker.estimatedResolutionTime}</p>
          </div>
        </div>

        {/* Owner Information */}
        <div className="mt-4 p-3 bg-ordino-card rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ordino-error/20 flex items-center justify-center">
              <User size={20} className="text-ordino-error" />
            </div>
            <div>
              <p className="text-sm font-medium text-ordino-text">Assigned to: {blocker.owner}</p>
              <p className="text-xs text-ordino-text-muted">Contact required for resolution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Chain (if escalated) */}
      {blocker.status === 'Escalated' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-ordino-bg p-4 border-t border-ordino-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-yellow-500" />
            <h4 className="font-semibold text-ordino-text">Escalation Path</h4>
            <Badge variant="warning" size="sm">Level {blocker.escalationLevel}</Badge>
          </div>

          <div className="flex items-center justify-between gap-4">
            {escalationChain.map((entry) => (
              <div key={entry.level} className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${
                    entry.status === 'current'
                      ? 'bg-ordino-primary/20 border-ordino-primary'
                      : entry.level < blocker.escalationLevel
                      ? 'bg-ordino-success/20 border-ordino-success'
                      : 'bg-ordino-card border-ordino-border'
                  }`}
                  animate={
                    entry.status === 'current'
                      ? {
                          boxShadow: [
                            '0 0 0 0 rgba(249, 115, 22, 0.4)',
                            '0 0 0 10px rgba(249, 115, 22, 0)',
                          ],
                        }
                      : {}
                  }
                  transition={
                    entry.status === 'current' ? { duration: 1.5, repeat: Infinity } : {}
                  }
                >
                  <User
                    size={24}
                    className={
                      entry.status === 'current'
                        ? 'text-ordino-primary'
                        : entry.level < blocker.escalationLevel
                        ? 'text-ordino-success'
                        : 'text-ordino-text-muted'
                    }
                  />
                </motion.div>
                <p className="text-xs font-medium text-ordino-text mt-2 text-center">{entry.name}</p>
                <p className="text-xs text-ordino-text-muted text-center">{entry.role}</p>
                <Badge
                  size="sm"
                  variant={
                    entry.status === 'current'
                      ? 'warning'
                      : entry.level < blocker.escalationLevel
                      ? 'success'
                      : 'secondary'
                  }
                  className="mt-1"
                >
                  SLA: {entry.slaHours}h
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Communication Log */}
      {communicationLog.length > 0 && blocker.status === 'Escalated' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-ordino-bg p-4 border-t border-ordino-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={18} className="text-ordino-primary" />
            <h4 className="font-semibold text-ordino-text">Communication Log</h4>
          </div>
          <div className="space-y-2">
            {communicationLog.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-ordino-card rounded-lg text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-ordino-text">
                    {log.from} → {log.to}
                  </span>
                  <Badge size="sm" variant="secondary">
                    {log.channel}
                  </Badge>
                </div>
                <p className="text-ordino-text-muted">{log.message}</p>
                <p className="text-ordino-text-muted/60 mt-1">
                  {formatTimeSince(log.timestamp)} ago
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="bg-ordino-bg p-4 border-t border-ordino-border">
        <div className="flex items-center justify-end gap-3">
          <p className="text-xs text-ordino-text-muted mr-auto">
            Manual override for demo purposes
          </p>
          {blocker.escalationLevel < 3 && onEscalate && (
            <Button variant="secondary" onClick={onEscalate} size="sm">
              <AlertCircle size={16} />
              Escalate
            </Button>
          )}
          <Button onClick={() => onResolve(blocker.id)} size="sm">
            <CheckCircle size={16} />
            Resolve Blocker
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
