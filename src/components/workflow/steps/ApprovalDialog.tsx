import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../../common';

interface ApprovalDialogProps {
  onApprove?: () => void;
  onReject?: () => void;
}

export function ApprovalDialog({ onApprove, onReject }: ApprovalDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="bg-ordino-card px-6 py-4 border-b border-ordino-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ordino-warning/20 flex items-center justify-center">
            <Clock size={20} className="text-ordino-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-ordino-text">Approval Required</h3>
            <p className="text-sm text-ordino-text-muted">Review generated test plan before applying</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-ordino-card rounded-lg">
            <p className="text-2xl font-bold text-ordino-primary">8</p>
            <p className="text-xs text-ordino-text-muted">New Test Cases</p>
          </div>
          <div className="text-center p-3 bg-ordino-card rounded-lg">
            <p className="text-2xl font-bold text-ordino-success">3</p>
            <p className="text-xs text-ordino-text-muted">Gaps Addressed</p>
          </div>
          <div className="text-center p-3 bg-ordino-card rounded-lg">
            <p className="text-2xl font-bold text-ordino-secondary">+12%</p>
            <p className="text-xs text-ordino-text-muted">Coverage Impact</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <FileText size={14} className="text-ordino-text-muted" />
            <span className="text-ordino-text-muted">Requirement:</span>
            <span className="text-ordino-text">ORD-1234 - Add two-factor authentication</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-ordino-text-muted" />
            <span className="text-ordino-text-muted">Requested by:</span>
            <span className="text-ordino-text">Ordino AI</span>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 p-3 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20">
          <AlertCircle size={16} className="text-ordino-warning flex-shrink-0 mt-0.5" />
          <p className="text-xs text-ordino-text-muted">
            Approving will automatically sync test cases to TestRail and create pull requests in GitHub.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="danger" onClick={onReject} className="flex-1">
            <XCircle size={18} />
            Reject
          </Button>
          <Button variant="primary" onClick={onApprove} className="flex-1">
            <CheckCircle size={18} />
            Approve
          </Button>
        </div>
      </div>

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}
