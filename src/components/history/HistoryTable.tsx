import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText, AlertTriangle, Bell, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../common';
import { formatDateTime } from '../../utils/helpers';
import type { HistoryEntry } from '../../types';

interface HistoryTableProps {
  entries: HistoryEntry[];
}

const categoryIcons = {
  'test-generation': FileText,
  'gap-analysis': AlertTriangle,
  notification: Bell,
  sync: RefreshCw,
};

const categoryLabels = {
  'test-generation': 'Test Generation',
  'gap-analysis': 'Gap Analysis',
  notification: 'Notification',
  sync: 'Sync',
};

export function HistoryTable({ entries }: HistoryTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'timestamp' | 'action'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortField === 'timestamp') {
      return sortDirection === 'desc'
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime();
    }
    return sortDirection === 'desc'
      ? b.action.localeCompare(a.action)
      : a.action.localeCompare(b.action);
  });

  const toggleSort = (field: 'timestamp' | 'action') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-ordino-bg border-b border-ordino-border text-xs font-medium text-ordino-text-muted uppercase tracking-wider">
          <div className="col-span-4 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('action')}>
            Action
            {sortField === 'action' && (sortDirection === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
          </div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('timestamp')}>
            Timestamp
            {sortField === 'timestamp' && (sortDirection === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-ordino-border">
          {sortedEntries.map((entry) => {
            const Icon = categoryIcons[entry.category];
            const isExpanded = expandedRow === entry.id;

            return (
              <div key={entry.id}>
                {/* Row */}
                <motion.div
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-ordino-bg/50 cursor-pointer transition-colors"
                  onClick={() => setExpandedRow(isExpanded ? null : entry.id)}
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ordino-bg flex items-center justify-center">
                      <Icon size={16} className="text-ordino-text-muted" />
                    </div>
                    <span className="text-sm font-medium text-ordino-text">{entry.action}</span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="default" size="sm">
                      {categoryLabels[entry.category]}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant={
                        entry.status === 'success' ? 'success' :
                        entry.status === 'pending' ? 'warning' : 'error'
                      }
                      size="sm"
                    >
                      {entry.status}
                    </Badge>
                  </div>
                  <div className="col-span-3 text-sm text-ordino-text-muted">
                    {formatDateTime(entry.timestamp)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} className="text-ordino-text-muted" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-ordino-bg/50"
                    >
                      <div className="px-6 py-4 ml-11 border-l-2 border-ordino-primary/30">
                        {entry.details.requirement && (
                          <div className="mb-3">
                            <p className="text-xs text-ordino-text-muted uppercase tracking-wider mb-1">Requirement</p>
                            <p className="text-sm text-ordino-text">{entry.details.requirement}</p>
                          </div>
                        )}
                        {entry.details.testCases && entry.details.testCases.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-ordino-text-muted uppercase tracking-wider mb-1">Generated Test Cases</p>
                            <ul className="space-y-1">
                              {entry.details.testCases.map((tc, i) => (
                                <li key={i} className="text-sm text-ordino-text flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-ordino-success" />
                                  {tc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.details.gaps && entry.details.gaps.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-ordino-text-muted uppercase tracking-wider mb-1">Identified Gaps</p>
                            <ul className="space-y-1">
                              {entry.details.gaps.map((gap, i) => (
                                <li key={i} className="text-sm text-ordino-warning flex items-center gap-2">
                                  <AlertTriangle size={12} />
                                  {gap}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.details.recipients && entry.details.recipients.length > 0 && (
                          <div>
                            <p className="text-xs text-ordino-text-muted uppercase tracking-wider mb-1">Notified Recipients</p>
                            <div className="flex gap-2">
                              {entry.details.recipients.map((recipient, i) => (
                                <Badge key={i} variant="info" size="sm">{recipient}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
