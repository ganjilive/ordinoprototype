import { motion } from 'framer-motion';
import { Bug, AlertTriangle, Code, Users, Clock } from 'lucide-react';
import { Badge } from '../../../common';
import { bugDetails } from '../../../../data/testFailureMockData';

export function BugDetection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-error/20 flex items-center justify-center"
        >
          <Bug size={32} className="text-ordino-error" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          Bug Detected in Product
        </h3>
        <p className="text-sm text-ordino-text-muted">
          Ordino has identified the root cause of test failures
        </p>
      </div>

      {/* Bug Details Card */}
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-error/30 p-6 space-y-4"
        >
          {/* Bug Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-mono font-bold text-ordino-primary">
                  {bugDetails.jiraKey}
                </span>
                <Badge variant="error" size="sm">{bugDetails.severity}</Badge>
              </div>
              <h4 className="text-base font-semibold text-ordino-text mb-2">
                {bugDetails.title}
              </h4>
            </div>
          </div>

          {/* Bug Description */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code size={16} className="text-ordino-text-muted" />
                <span className="text-sm font-medium text-ordino-text">Component</span>
              </div>
              <p className="text-sm text-ordino-text-muted ml-6">
                {bugDetails.component}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-ordino-text-muted" />
                <span className="text-sm font-medium text-ordino-text">Affected Test Cases</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-6">
                {bugDetails.affectedTestCases.map((tc) => (
                  <Badge key={tc} variant="info" size="sm">{tc}</Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-ordino-text-muted" />
                <span className="text-sm font-medium text-ordino-text">Root Cause</span>
              </div>
              <p className="text-sm text-ordino-text-muted ml-6">
                {bugDetails.rootCause}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-ordino-text-muted" />
                <span className="text-sm font-medium text-ordino-text">Suggested Fix</span>
              </div>
              <div className="bg-ordino-card rounded-lg p-3 ml-6">
                <pre className="text-xs text-ordino-text-muted whitespace-pre-wrap font-mono">
                  {bugDetails.suggestedFix}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-ordino-primary/10 border border-ordino-primary/20 rounded-xl"
        >
          <p className="text-xs text-ordino-text-muted text-center">
            Bug details prepared. Ready to create JIRA ticket...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
