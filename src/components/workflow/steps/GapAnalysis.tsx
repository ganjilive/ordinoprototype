import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../../common';

const gaps = [
  {
    id: 1,
    area: 'Authentication Flow',
    description: 'Missing edge case tests for 2FA timeout scenarios',
    severity: 'high',
    existing: 4,
    needed: 6,
  },
  {
    id: 2,
    area: 'Error Handling',
    description: 'No tests for invalid authenticator code formats',
    severity: 'medium',
    existing: 2,
    needed: 4,
  },
  {
    id: 3,
    area: 'Recovery Flow',
    description: 'Backup code consumption tests incomplete',
    severity: 'low',
    existing: 1,
    needed: 3,
  },
];

const existingCoverage = [
  { area: 'Login Flow', coverage: 94, status: 'good' },
  { area: 'Session Management', coverage: 88, status: 'good' },
  { area: 'Password Reset', coverage: 76, status: 'warning' },
];

export function GapAnalysis() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 gap-6"
    >
      {/* Existing Coverage */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={20} className="text-ordino-success" />
          <h4 className="font-semibold text-ordino-text">Existing Coverage</h4>
        </div>
        <div className="space-y-3">
          {existingCoverage.map((item, index) => (
            <motion.div
              key={item.area}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-ordino-text">{item.area}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-ordino-border rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${item.status === 'good' ? 'bg-ordino-success' : 'bg-ordino-warning'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.coverage}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-ordino-text-muted w-10">{item.coverage}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Identified Gaps */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-ordino-warning" />
          <h4 className="font-semibold text-ordino-text">Identified Gaps</h4>
          <Badge variant="warning" size="sm">{gaps.length} found</Badge>
        </div>
        <div className="space-y-3">
          {gaps.map((gap, index) => (
            <motion.div
              key={gap.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="p-3 bg-ordino-card rounded-lg border border-ordino-border"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm font-medium text-ordino-text">{gap.area}</span>
                <Badge
                  variant={gap.severity === 'high' ? 'error' : gap.severity === 'medium' ? 'warning' : 'default'}
                  size="sm"
                >
                  {gap.severity}
                </Badge>
              </div>
              <p className="text-xs text-ordino-text-muted mb-2">{gap.description}</p>
              <div className="flex items-center gap-2 text-xs">
                <XCircle size={12} className="text-ordino-error" />
                <span className="text-ordino-text-muted">
                  {gap.existing} existing / {gap.needed} needed
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
