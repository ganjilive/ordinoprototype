import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, ExternalLink, Send } from 'lucide-react';
import { Badge } from '../../../common';
import { bugDetails } from '../../../../data/testFailureMockData';

const reportPhases = ['Preparing Ticket', 'Creating in JIRA', 'Ticket Created'];

export function JiraBugReport({ onComplete }: { onComplete: () => void }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [ticketCreated, setTicketCreated] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 0: Preparing
    timers.push(setTimeout(() => {
      setCompletedPhases(prev => [...prev, 0]);
      setCurrentPhase(1);
    }, 1500));

    // Phase 1: Creating
    timers.push(setTimeout(() => {
      setCompletedPhases(prev => [...prev, 1]);
      setTicketCreated(true);
      setCurrentPhase(2);
    }, 3000));

    // Phase 2: Complete
    timers.push(setTimeout(() => {
      setCompletedPhases(prev => [...prev, 2]);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }, 4500));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Phase Progress Indicator */}
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
        {reportPhases.map((label, index) => {
          const isDone = completedPhases.includes(index);
          const isActive = currentPhase === index && !isDone;

          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    isDone
                      ? 'bg-ordino-success/20 border-ordino-success text-ordino-success'
                      : isActive
                        ? 'bg-ordino-primary/20 border-ordino-primary text-ordino-primary'
                        : 'bg-ordino-card border-ordino-border text-ordino-text-muted'
                  }`}
                  animate={isActive ? {
                    boxShadow: [
                      '0 0 0 0 rgba(249, 115, 22, 0.3)',
                      '0 0 12px 4px rgba(249, 115, 22, 0)',
                    ],
                  } : {}}
                  transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  {isDone ? <CheckCircle size={16} /> : index + 1}
                </motion.div>
                <span className={`text-[10px] font-medium whitespace-nowrap ${
                  isDone
                    ? 'text-ordino-success'
                    : isActive
                      ? 'text-ordino-primary'
                      : 'text-ordino-text-muted'
                }`}>
                  {label}
                </span>
              </div>
              {index < reportPhases.length - 1 && (
                <div className="h-0.5 w-6 bg-ordino-border rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-ordino-success"
                    initial={{ width: '0%' }}
                    animate={{ width: isDone ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Phase 0 & 1: Preparing/Creating */}
        {(currentPhase === 0 || currentPhase === 1) && (
          <motion.div
            key="creating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(249, 115, 22, 0.4)',
                    '0 0 20px 10px rgba(249, 115, 22, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {currentPhase === 0 ? (
                  <Loader2 size={32} className="text-ordino-primary animate-spin" />
                ) : (
                  <Send size={32} className="text-ordino-primary" />
                )}
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">
                {currentPhase === 0 ? 'Preparing JIRA Ticket' : 'Creating Ticket in JIRA'}
              </h3>
              <p className="text-sm text-ordino-text-muted">
                {currentPhase === 0
                  ? 'Gathering bug details and formatting ticket'
                  : 'Submitting ticket to JIRA...'}
              </p>
            </div>

            {/* Ticket Preview */}
            <div className="max-w-md mx-auto bg-ordino-bg rounded-xl border border-ordino-border p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-medium text-ordino-primary">
                    {bugDetails.jiraKey}
                  </span>
                  <Badge variant="error" size="sm">{bugDetails.severity}</Badge>
                </div>
                <p className="text-sm font-medium text-ordino-text">{bugDetails.title}</p>
                <p className="text-xs text-ordino-text-muted line-clamp-2">
                  {bugDetails.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Complete */}
        {currentPhase === 2 && ticketCreated && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-success/20 flex items-center justify-center"
              >
                <CheckCircle size={32} className="text-ordino-success" />
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Bug Reported in JIRA</h3>
              <p className="text-sm text-ordino-text-muted">
                Ticket {bugDetails.jiraKey} has been created successfully
              </p>
            </div>

            {/* Ticket Card */}
            <div className="max-w-md mx-auto bg-ordino-bg rounded-xl border border-ordino-success/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold text-ordino-primary">
                    {bugDetails.jiraKey}
                  </span>
                  <Badge variant="error" size="sm">{bugDetails.severity}</Badge>
                </div>
                <a
                  href="#"
                  className="text-ordino-primary hover:underline flex items-center gap-1 text-xs"
                >
                  View in JIRA
                  <ExternalLink size={12} />
                </a>
              </div>
              <p className="text-sm font-medium text-ordino-text mb-2">{bugDetails.title}</p>
              <p className="text-xs text-ordino-text-muted mb-3">{bugDetails.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ordino-text-muted">
                  Component: {bugDetails.component}
                </span>
                <Badge variant="success" size="sm">Created</Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
