import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Button, Badge } from '../../common';
import { approvalChains } from '../../../data/mockData';
import { useState, useEffect } from 'react';

interface TriageApprovalProps {
  onApprove: () => void;
  onReject: () => void;
}

type ApprovalEntry =
  | { id: number; role: string; name: string; order: number; status: 'pending' }
  | { id: number; role: string; name: string; order: number; status: 'approved'; timestamp: Date };

export function TriageApproval({ onApprove, onReject }: TriageApprovalProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [approvalStates, setApprovalStates] = useState<ApprovalEntry[]>(
    approvalChains.triage.map((entry) => ({ ...entry, status: 'pending' as const }))
  );

  // Auto-progress through approval chain
  useEffect(() => {
    if (currentLevel < approvalChains.triage.length) {
      const timer = setTimeout(() => {
        setApprovalStates((prev) =>
          prev.map((entry, index) =>
            index === currentLevel ? { ...entry, status: 'approved' as const, timestamp: new Date() } : entry
          )
        );
        setCurrentLevel(currentLevel + 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentLevel]);

  // Auto-approve when all levels complete
  useEffect(() => {
    if (currentLevel === approvalChains.triage.length) {
      const timer = setTimeout(() => {
        onApprove();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentLevel, onApprove]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-ordino-success';
      case 'rejected':
        return 'text-ordino-error';
      case 'pending':
        return 'text-ordino-text-muted';
      default:
        return 'text-ordino-text-muted';
    }
  };

  const getStatusIcon = (status: string, index: number) => {
    if (status === 'approved') {
      return <CheckCircle size={20} className="text-ordino-success" />;
    }
    if (status === 'rejected') {
      return <XCircle size={20} className="text-ordino-error" />;
    }
    if (index === currentLevel) {
      return <Clock size={20} className="text-ordino-primary animate-pulse" />;
    }
    return <User size={20} className="text-ordino-text-muted" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Multi-Level Triage Approval</h3>
          <p className="text-sm text-ordino-text-muted">
            Requirements analysis must be approved by all reviewers
          </p>
        </div>
        <Badge variant="warning">
          Level {currentLevel + 1} of {approvalChains.triage.length}
        </Badge>
      </div>

      {/* Approval Chain Timeline */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-6">
        <h4 className="font-semibold text-ordino-text mb-4">Approval Chain Progress</h4>

        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-ordino-border" />

          {/* Progress line */}
          <motion.div
            className="absolute top-8 left-0 h-0.5 bg-ordino-primary"
            initial={{ width: '0%' }}
            animate={{
              width: `${(currentLevel / (approvalChains.triage.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Approval steps */}
          <div className="relative flex justify-between">
            {approvalStates.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                {/* Avatar circle */}
                <motion.div
                  className={`
                    relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                    border-4 transition-all bg-ordino-card
                    ${
                      entry.status === 'approved'
                        ? 'border-ordino-success'
                        : index === currentLevel
                        ? 'border-ordino-primary'
                        : 'border-ordino-border'
                    }
                  `}
                  animate={
                    index === currentLevel
                      ? {
                          boxShadow: [
                            '0 0 0 0 rgba(249, 115, 22, 0.4)',
                            '0 0 0 10px rgba(249, 115, 22, 0)',
                          ],
                        }
                      : {}
                  }
                  transition={
                    index === currentLevel ? { duration: 1.5, repeat: Infinity } : {}
                  }
                >
                  {getStatusIcon(entry.status, index)}
                </motion.div>

                {/* Name and role */}
                <div className="mt-3 text-center">
                  <p className={`text-sm font-medium ${getStatusColor(entry.status)}`}>
                    {entry.name}
                  </p>
                  <p className="text-xs text-ordino-text-muted">{entry.role}</p>
                  {'timestamp' in entry && entry.timestamp && (
                    <p className="text-xs text-ordino-success mt-1">
                      Approved
                    </p>
                  )}
                  {index === currentLevel && (
                    <p className="text-xs text-ordino-primary mt-1 animate-pulse">
                      Reviewing...
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Reviewer Info */}
      {currentLevel < approvalChains.triage.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          key={currentLevel}
          className="bg-gradient-to-r from-ordino-primary/10 to-transparent rounded-xl border border-ordino-primary/20 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-ordino-primary/20 flex items-center justify-center">
              <User size={20} className="text-ordino-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-ordino-text">
                Current Reviewer: {approvalStates[currentLevel].name}
              </p>
              <p className="text-xs text-ordino-text-muted">
                {approvalStates[currentLevel].role} is reviewing the triage analysis
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Approval History */}
      {currentLevel > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <h4 className="font-semibold text-ordino-text mb-3">Approval History</h4>
          <div className="space-y-2">
            {approvalStates
              .filter((entry) => entry.status === 'approved')
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-ordino-card rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-ordino-success" />
                    <span className="text-sm text-ordino-text">
                      {entry.name} ({entry.role})
                    </span>
                  </div>
                  <span className="text-xs text-ordino-text-muted">
                    Approved
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Manual Override (for demo purposes) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-end gap-3 pt-4 border-t border-ordino-border"
      >
        <p className="text-xs text-ordino-text-muted mr-auto">
          Manual override for demo purposes
        </p>
        <Button variant="ghost" onClick={onReject} size="sm">
          <XCircle size={16} />
          Reject
        </Button>
        <Button onClick={onApprove} size="sm">
          <CheckCircle size={16} />
          Skip to Approve
        </Button>
      </motion.div>
    </motion.div>
  );
}
