import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle, User, Clock, MessageSquare, Bell, Mail } from 'lucide-react';
import { Button, Badge } from '../../../common';

interface RCAApprovalProps {
  onApprove: () => void;
}

const reviewers = [
  { role: 'QA Lead', name: 'Sarah Chen', avatar: 'SC', team: 'qa' },
  { role: 'Senior QA', name: 'Michael Torres', avatar: 'MT', team: 'qa' },
  { role: 'Backend Dev', name: 'David Kim', avatar: 'DK', team: 'dev' },
];

export function RCAApproval({ onApprove }: RCAApprovalProps) {
  const [phase, setPhase] = useState(0);
  const [notifiedReviewers, setNotifiedReviewers] = useState<string[]>([]);
  const [reviewedBy, setReviewedBy] = useState<string[]>([]);
  const [approved, setApproved] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Phase 0: Notify reviewers one by one
    if (phase === 0) {
      const timers: ReturnType<typeof setTimeout>[] = [];

      reviewers.forEach((reviewer, index) => {
        const t = setTimeout(() => {
          setNotifiedReviewers(prev => [...prev, reviewer.name]);
        }, index * 800);
        timers.push(t);
      });

      const phaseTimer = setTimeout(() => {
        setPhase(1);
      }, reviewers.length * 800 + 500);
      timers.push(phaseTimer);

      return () => timers.forEach(clearTimeout);
    }
  }, [phase]);

  useEffect(() => {
    // Phase 1: Collect reviews one by one
    if (phase === 1) {
      const timers: ReturnType<typeof setTimeout>[] = [];

      reviewers.forEach((reviewer, index) => {
        const t = setTimeout(() => {
          setReviewedBy(prev => [...prev, reviewer.name]);
        }, index * 1000);
        timers.push(t);
      });

      const phaseTimer = setTimeout(() => {
        setPhase(2);
      }, reviewers.length * 1000 + 500);
      timers.push(phaseTimer);

      return () => timers.forEach(clearTimeout);
    }
  }, [phase]);

  const handleApprove = () => {
    setApproved(true);
    setNotifying(true);

    // Send notifications
    const notificationList = ['#qa-team', 'dev-team@company.com', '@sarah.chen'];
    notificationList.forEach((recipient, index) => {
      setTimeout(() => {
        setNotifications(prev => [...prev, recipient]);
      }, index * 500);
    });

    // Complete workflow
    setTimeout(() => {
      setNotifying(false);
      onApprove();
    }, notificationList.length * 500 + 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
          animate={phase < 2 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Users size={28} className="text-ordino-secondary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          {phase === 0 && 'Notifying Reviewers...'}
          {phase === 1 && 'Collecting Reviews...'}
          {phase === 2 && !approved && 'All Reviews Received'}
          {approved && 'RCA Findings Approved!'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase === 0 && 'Sending RCA findings to QA team and relevant developers'}
          {phase === 1 && 'Team members are reviewing the root cause analysis'}
          {phase === 2 && !approved && 'Ready for final approval to proceed with corrective actions'}
          {approved && 'Stakeholders notified of approved findings and corrective actions'}
        </p>
      </div>

      {/* Reviewer Cards */}
      {phase >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
            Review Team
          </h4>

          <AnimatePresence>
            {reviewers.map((reviewer) => (
              <motion.div
                key={reviewer.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-ordino-card rounded-lg border border-ordino-border p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      reviewer.team === 'qa' ? 'bg-ordino-success/20' : 'bg-ordino-secondary/20'
                    }`}>
                      <span className={`text-sm font-semibold ${
                        reviewer.team === 'qa' ? 'text-ordino-success' : 'text-ordino-secondary'
                      }`}>
                        {reviewer.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ordino-text">{reviewer.name}</p>
                      <p className="text-xs text-ordino-text-muted">{reviewer.role}</p>
                    </div>
                  </div>

                  {!notifiedReviewers.includes(reviewer.name) ? (
                    <Badge variant="default" size="sm">Preparing...</Badge>
                  ) : !reviewedBy.includes(reviewer.name) ? (
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-ordino-warning animate-pulse" />
                      <span className="text-xs text-ordino-warning">Reviewing</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-ordino-success" />
                      <span className="text-xs text-ordino-success font-medium">Approved</span>
                    </div>
                  )}
                </div>

                {/* Show review comment if completed */}
                {reviewedBy.includes(reviewer.name) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-ordino-border"
                  >
                    <div className="flex items-start gap-2 text-xs">
                      <User size={12} className="text-ordino-secondary mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-ordino-text">Review Comment:</span>
                        <span className="text-ordino-text-muted ml-1">
                          {reviewer.team === 'qa'
                            ? 'RCA findings look accurate. Recommend updating test suite to prevent regression.'
                            : 'Concur with RCA. Will implement fix in test locators and add validation.'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Approval Section */}
      {phase === 2 && !approved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-ordino-primary/10 to-ordino-success/5 rounded-xl border border-ordino-primary/30 p-6"
        >
          <div className="text-center mb-4">
            <CheckCircle size={48} className="text-ordino-success mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-ordino-text mb-2">
              RCA Findings Reviewed and Ready
            </h3>
            <p className="text-sm text-ordino-text-muted">
              All team members have reviewed the root cause analysis. Approve to proceed with corrective actions.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="ghost" size="lg">
              Request Changes
            </Button>
            <Button onClick={handleApprove} size="lg">
              <CheckCircle size={18} />
              Approve RCA Findings
            </Button>
          </div>
        </motion.div>
      )}

      {/* Notifications */}
      {approved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-card rounded-lg border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-ordino-primary" />
            <h5 className="text-sm font-semibold text-ordino-text">
              {notifying ? 'Notifying Stakeholders...' : 'Notifications Sent'}
            </h5>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {notifications.map((recipient) => (
                <motion.div
                  key={recipient}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-sm"
                >
                  {recipient.startsWith('#') ? (
                    <MessageSquare size={14} className="text-pink-500" />
                  ) : recipient.includes('@') && recipient.includes('.') ? (
                    <Mail size={14} className="text-blue-500" />
                  ) : (
                    <MessageSquare size={14} className="text-pink-500" />
                  )}
                  <span className="text-ordino-text-muted">{recipient}</span>
                  <CheckCircle size={14} className="text-ordino-success ml-auto" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
