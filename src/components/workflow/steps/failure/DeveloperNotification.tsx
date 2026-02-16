import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Send, User, MessageSquare } from 'lucide-react';
import { Badge } from '../../../common';
import { developerNotification, bugDetails } from '../../../../data/testFailureMockData';

const notificationPhases = ['Preparing', 'Sending', 'Sent'];

export function DeveloperNotification({ onComplete }: { onComplete: () => void }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 0: Preparing
    timers.push(setTimeout(() => {
      setCompletedPhases(prev => [...prev, 0]);
      setCurrentPhase(1);
    }, 1500));

    // Phase 1: Sending
    timers.push(setTimeout(() => {
      setCompletedPhases(prev => [...prev, 1]);
      setNotificationSent(true);
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
        {notificationPhases.map((label, index) => {
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
              {index < notificationPhases.length - 1 && (
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
        {/* Phase 0 & 1: Preparing/Sending */}
        {(currentPhase === 0 || currentPhase === 1) && (
          <motion.div
            key="sending"
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
                  <Mail size={32} className="text-ordino-primary" />
                ) : (
                  <Send size={32} className="text-ordino-primary" />
                )}
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">
                {currentPhase === 0 ? 'Preparing Notification' : 'Notifying Developer'}
              </h3>
              <p className="text-sm text-ordino-text-muted">
                {currentPhase === 0
                  ? 'Composing message with bug details and suggestions'
                  : 'Sending notification to developer...'}
              </p>
            </div>

            {/* Notification Preview */}
            <div className="max-w-md mx-auto bg-ordino-bg rounded-xl border border-ordino-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-ordino-secondary/20 flex items-center justify-center">
                  <User size={20} className="text-ordino-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ordino-text">
                    {developerNotification.developer}
                  </p>
                  <p className="text-xs text-ordino-text-muted">
                    {developerNotification.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="error" size="sm">{bugDetails.jiraKey}</Badge>
                  <span className="text-xs text-ordino-text-muted">Critical Bug</span>
                </div>
                <p className="text-sm text-ordino-text">{developerNotification.message}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Complete */}
        {currentPhase === 2 && notificationSent && (
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
              <h3 className="text-lg font-semibold text-ordino-text">Developer Notified</h3>
              <p className="text-sm text-ordino-text-muted">
                Notification sent with bug details and suggestions
              </p>
            </div>

            {/* Notification Card */}
            <div className="max-w-md mx-auto bg-ordino-bg rounded-xl border border-ordino-success/30 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-ordino-secondary/20 flex items-center justify-center">
                  <User size={20} className="text-ordino-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ordino-text">
                    {developerNotification.developer}
                  </p>
                  <p className="text-xs text-ordino-text-muted">
                    {developerNotification.email}
                  </p>
                </div>
                <Badge variant="success" size="sm">Sent</Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={14} className="text-ordino-text-muted" />
                    <span className="text-xs font-medium text-ordino-text">Message</span>
                  </div>
                  <p className="text-sm text-ordino-text-muted ml-6">
                    {developerNotification.message}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-ordino-text">Suggestions</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {developerNotification.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-xs text-ordino-primary mt-0.5">•</span>
                        <p className="text-xs text-ordino-text-muted">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
