import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FileText, ClipboardList, TestTube, CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../common';
import { cn } from '../../utils/helpers';
import type { TraceabilityNode } from '../../types';

interface TraceabilityViewProps {
  nodes: TraceabilityNode[];
}

const nodeIcons = {
  requirement: FileText,
  'test-plan': ClipboardList,
  'test-case': TestTube,
};

const statusIcons = {
  passed: CheckCircle,
  failed: XCircle,
  pending: Clock,
  'not-run': HelpCircle,
};

const statusColors = {
  passed: 'text-ordino-success',
  failed: 'text-ordino-error',
  pending: 'text-ordino-warning',
  'not-run': 'text-ordino-text-muted',
};

function TreeNode({ node, level = 0 }: { node: TraceabilityNode; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const Icon = nodeIcons[node.type];
  const StatusIcon = statusIcons[node.status];
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-ordino-bg/50 cursor-pointer transition-colors',
          level > 0 && 'ml-6'
        )}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} className="text-ordino-text-muted" />
          </motion.div>
        ) : (
          <div className="w-4" />
        )}

        {/* Node icon */}
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          node.type === 'requirement' && 'bg-ordino-primary/20',
          node.type === 'test-plan' && 'bg-ordino-secondary/20',
          node.type === 'test-case' && 'bg-ordino-card'
        )}>
          <Icon size={16} className={cn(
            node.type === 'requirement' && 'text-ordino-primary',
            node.type === 'test-plan' && 'text-ordino-secondary',
            node.type === 'test-case' && 'text-ordino-text-muted'
          )} />
        </div>

        {/* Node title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ordino-text truncate">{node.title}</p>
          <p className="text-xs text-ordino-text-muted capitalize">{node.type.replace('-', ' ')}</p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <StatusIcon size={16} className={statusColors[node.status]} />
          <Badge
            variant={
              node.status === 'passed' ? 'success' :
              node.status === 'failed' ? 'error' :
              node.status === 'pending' ? 'warning' : 'default'
            }
            size="sm"
          >
            {node.status}
          </Badge>
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-l-2 border-ordino-border ml-5"
          >
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TraceabilityView({ nodes }: TraceabilityViewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Traceability Tree</CardTitle>
        <div className="flex items-center gap-4 text-xs text-ordino-text-muted">
          <div className="flex items-center gap-1">
            <CheckCircle size={12} className="text-ordino-success" />
            <span>Passed</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle size={12} className="text-ordino-error" />
            <span>Failed</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-ordino-warning" />
            <span>Pending</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {nodes.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
