import { motion } from 'framer-motion';
import { ExternalLink, User, Calendar, Tag } from 'lucide-react';
import { Badge } from '../../common';
import { sampleRequirement } from '../../../data/mockData';

export function JiraRequirement() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden"
    >
      {/* Jira-like header */}
      <div className="bg-blue-600 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xs">J</span>
          </div>
          <span className="text-white font-medium text-sm">{sampleRequirement.key}</span>
        </div>
        <ExternalLink size={16} className="text-white/70" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-ordino-text">
          {sampleRequirement.title}
        </h3>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3">
          <Badge variant="error" size="sm">
            {sampleRequirement.priority}
          </Badge>
          <Badge variant="success" size="sm">
            {sampleRequirement.status}
          </Badge>
        </div>

        {/* Description */}
        <div className="text-sm text-ordino-text-muted whitespace-pre-line">
          {sampleRequirement.description}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-ordino-border flex flex-wrap gap-4 text-xs text-ordino-text-muted">
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>Assignee: {sampleRequirement.assignee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Created: Jan 15, 2024</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag size={12} />
            <span>{sampleRequirement.labels.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Animated highlight */}
      <motion.div
        className="absolute inset-0 border-2 border-ordino-primary rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
