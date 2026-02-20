import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle, Clock, FileText, ExternalLink, Send } from 'lucide-react';
import { Button, Badge } from '../../../common';

interface TestPlanCollaborationProps {
  onCollaborationComplete: () => void;
}

const stakeholders = [
  { role: 'QA Lead', name: 'Sarah Chen', avatar: 'SC' },
  { role: 'QA Manager', name: 'Michael Torres', avatar: 'MT' },
  { role: 'Architect', name: 'David Kim', avatar: 'DK' },
];

const existingPlans = [
  { id: 'TP-2023-001', name: 'Authentication Test Plan', coverage: '85%' },
  { id: 'TP-2023-005', name: 'API Security Test Plan', coverage: '92%' },
];

export function TestPlanCollaboration({ onCollaborationComplete }: TestPlanCollaborationProps) {
  const [phase, setPhase] = useState(0);
  const [sentTo, setSentTo] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Record<string, { section: string; comment: string }[]>>({});
  const [allFeedbackReceived, setAllFeedbackReceived] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Phase 0: Preparing template (1.5s) → phase 1
  useEffect(() => {
    if (phase !== 0) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase(1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 1: Send to stakeholders with stagger → phase 2
  useEffect(() => {
    if (phase !== 1) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    stakeholders.forEach((stakeholder, index) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        setSentTo(prev => [...prev, stakeholder.name]);
      }, index * 800);
      timers.push(t);
    });

    const done = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase(2);
    }, stakeholders.length * 800 + 500);
    timers.push(done);

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Phase 2: Collect feedback → phase 3
  useEffect(() => {
    if (phase !== 2) return;

    const mockFeedback: Record<string, { section: string; comment: string }[]> = {
      'Sarah Chen': [
        { section: '1. Test Scope', comment: 'Include mobile app testing for 2FA' },
        { section: '3. Test Environment', comment: 'Need staging environment with SMS gateway' },
      ],
      'Michael Torres': [
        { section: '2. Test Strategy', comment: 'Add security penetration testing' },
        { section: '4. Entry/Exit Criteria', comment: 'Define code coverage threshold (80%)' },
      ],
      'David Kim': [
        { section: '2. Test Strategy', comment: 'Ensure integration with existing auth system' },
        { section: '3. Test Environment', comment: 'Use containerized test environment' },
      ],
    };

    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setFeedback(mockFeedback);
      setAllFeedbackReceived(true);
      setPhase(3);
    }, 3000);

    return () => clearTimeout(timer);
  }, [phase]);

  const handleComplete = () => {
    onCollaborationComplete();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
          animate={phase < 3 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Users size={28} className="text-ordino-secondary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          {phase === 0 && 'Drafting Test Plan Template...'}
          {phase === 1 && 'Stakeholders are reviewing the template and providing their input...'}
          {phase === 2 && 'All stakeholders have provided their input to the test plan'}
          {phase === 3 && 'Input Collection Complete!'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase === 0 && 'Creating a test plan template based on IEEE 829 standards and existing plans'}
          {phase === 1 && 'Template sent to QA Lead, QA Manager, and Architect to fill in their sections'}
          {phase === 2 && 'Stakeholders are filling in the test plan template with their expertise'}
          {phase === 3 && 'All sections filled in and ready for refinement'}
        </p>
      </div>

      {/* Existing Plans Reference */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-card rounded-lg border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-ordino-primary" />
            <h4 className="text-sm font-semibold text-ordino-text">Reference Plans</h4>
          </div>
          <div className="space-y-2">
            {existingPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-2 bg-ordino-bg rounded">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-ordino-primary">{plan.id}</span>
                  <span className="text-sm text-ordino-text">{plan.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">Coverage: {plan.coverage}</Badge>
                  <ExternalLink size={14} className="text-ordino-text-muted" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stakeholder Cards */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
            Collaboration Status
          </h4>

          <AnimatePresence>
            {stakeholders.map((stakeholder) => (
              <motion.div
                key={stakeholder.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-ordino-card rounded-lg border border-ordino-border p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ordino-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-ordino-primary">{stakeholder.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ordino-text">{stakeholder.name}</p>
                      <p className="text-xs text-ordino-text-muted">{stakeholder.role}</p>
                    </div>
                  </div>

                  {sentTo.includes(stakeholder.name) ? (
                    phase >= 3 ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-ordino-success" />
                        <span className="text-xs text-ordino-success font-medium">
                          {feedback[stakeholder.name]?.length || 0} sections filled
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-ordino-warning animate-pulse" />
                        <span className="text-xs text-ordino-warning">Pending</span>
                      </div>
                    )
                  ) : (
                    <Badge variant="default" size="sm">Sending...</Badge>
                  )}
                </div>

                {/* Show feedback if received */}
                {phase >= 3 && feedback[stakeholder.name] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-ordino-border space-y-2"
                  >
                    {feedback[stakeholder.name].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <Send size={12} className="text-ordino-secondary mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-ordino-text">{item.section}:</span>
                          <span className="text-ordino-text-muted ml-1">{item.comment}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Complete Button */}
      {allFeedbackReceived && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center pt-4"
        >
          <Button onClick={handleComplete} size="lg">
            <CheckCircle size={18} />
            Continue to Refinement
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
