import { motion } from 'framer-motion';
import { CheckCircle, User, FileText } from 'lucide-react';
import { Button, Badge } from '../../common';
import { useState, useEffect } from 'react';

interface PeerReviewProps {
  onApprove: () => void;
  onReject: () => void;
}

export function PeerReview({ onApprove, onReject }: PeerReviewProps) {
  const [isReviewing, setIsReviewing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReviewing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReviewing) {
      const timer = setTimeout(() => {
        onApprove();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isReviewing, onApprove]);

  const reviewChecklist = [
    { id: 1, item: 'Test coverage completeness', status: 'checked' },
    { id: 2, item: 'Adherence to testing standards', status: 'checked' },
    { id: 3, item: 'Automation strategy viability', status: 'checked' },
    { id: 4, item: 'Test data requirements', status: 'checking' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Peer Review</h3>
          <p className="text-sm text-ordino-text-muted">
            First-level review of drafted test design
          </p>
        </div>
        <Badge variant={isReviewing ? 'warning' : 'success'}>
          {isReviewing ? 'In Review' : 'Approved'}
        </Badge>
      </div>

      {/* Reviewer Info */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-ordino-primary/20 flex items-center justify-center">
            <User size={28} className="text-ordino-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ordino-text">Alex Kim</p>
            <p className="text-sm text-ordino-text-muted">Peer Reviewer • Senior QA Engineer</p>
            <p className="text-xs text-ordino-text-muted mt-1">
              5+ years experience in test automation
            </p>
          </div>
          {!isReviewing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-full bg-ordino-success/20 flex items-center justify-center"
            >
              <CheckCircle size={20} className="text-ordino-success" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Review Checklist */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} className="text-ordino-primary" />
          <h4 className="font-semibold text-ordino-text">Review Checklist</h4>
        </div>

        <div className="space-y-3">
          {reviewChecklist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              className="flex items-center gap-3 p-3 bg-ordino-card rounded-lg"
            >
              {item.status === 'checked' ? (
                <CheckCircle size={18} className="text-ordino-success" />
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-ordino-primary border-t-transparent rounded-full"
                />
              )}
              <span className={`text-sm ${item.status === 'checked' ? 'text-ordino-text' : 'text-ordino-text-muted'}`}>
                {item.item}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Review Comments */}
      {!isReviewing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <h4 className="font-semibold text-ordino-text mb-2">Reviewer Comments</h4>
          <div className="bg-ordino-card p-3 rounded-lg">
            <p className="text-sm text-ordino-text-muted italic">
              "Test design is comprehensive and follows best practices. Automation strategy is well-thought-out
              with realistic feasibility assessments. Ready for lead review."
            </p>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-ordino-border">
            <span className="text-xs text-ordino-text-muted">Alex Kim</span>
            <Badge variant="success" size="sm">Approved</Badge>
          </div>
        </motion.div>
      )}

      {/* Manual Override */}
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
