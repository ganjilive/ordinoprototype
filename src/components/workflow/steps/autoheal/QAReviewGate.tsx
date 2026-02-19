import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { Button } from '../../../common';
import { qaSlackMessages, healingStrategies } from '../../../../data/autoHealMockData';

interface QAReviewGateProps {
  onApprove: () => void;
}

export function QAReviewGate({ onApprove }: QAReviewGateProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Phase 0 → 1: composing Slack messages (1.5s)
  useEffect(() => {
    if (currentPhase !== 0) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(1);
    }, 1500);
    return () => clearTimeout(t);
  }, [currentPhase]);

  // Phase 1: stagger send messages → phase 2
  useEffect(() => {
    if (currentPhase !== 1) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    qaSlackMessages.forEach((msg, i) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        setSentMessages((prev) => [...prev, msg.id]);
      }, i * 600);
      timers.push(t);
    });

    const done = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(2);
    }, qaSlackMessages.length * 600 + 400);
    timers.push(done);

    return () => timers.forEach(clearTimeout);
  }, [currentPhase]);

  const at203 = healingStrategies.find((s) => s.testId === 'AT-203');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-warning/20 flex items-center justify-center"
          animate={currentPhase < 2 ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {currentPhase >= 2 ? (
            <Users size={32} className="text-ordino-warning" />
          ) : (
            <MessageSquare size={32} className="text-ordino-warning" />
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {currentPhase === 0
            ? 'Composing Review Requests...'
            : currentPhase === 1
            ? 'Notifying QA Team...'
            : 'Awaiting QA Approval'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {currentPhase < 2
            ? 'AT-203 confidence 71/100 — human review required before commit'
            : 'Workflow paused — review AT-203 diff and approve to proceed'}
        </p>
      </div>

      {/* Phase 0: shimmer */}
      {currentPhase === 0 && (
        <div className="max-w-lg mx-auto space-y-3">
          {qaSlackMessages.map((msg) => (
            <div key={msg.id} className="p-4 bg-ordino-bg rounded-xl border border-ordino-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-28 bg-ordino-border rounded animate-pulse" />
                  <div className="h-2 w-20 bg-ordino-border/60 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-ordino-border rounded animate-pulse" />
                <div className="h-2 bg-ordino-border rounded animate-pulse w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phase 1+: Slack message cards */}
      {currentPhase >= 1 && (
        <div className="max-w-lg mx-auto space-y-3">
          <AnimatePresence>
            {qaSlackMessages.map((msg) => {
              const isSent = sentMessages.includes(msg.id);
              if (!isSent && currentPhase === 1) return null;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-ordino-bg rounded-xl border border-ordino-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center flex-shrink-0">
                      <MessageSquare size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-ordino-text">Slack</span>
                        <span className="text-xs text-ordino-text-muted">{msg.recipient}</span>
                        <span className="text-xs text-ordino-text-muted">{msg.channel}</span>
                        {isSent && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-ordino-success/20 text-ordino-success border border-ordino-success/30"
                          >
                            Sent
                          </motion.span>
                        )}
                      </div>
                      <p className="text-xs text-ordino-text-muted leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Phase 2: diff display + approval button */}
      {currentPhase >= 2 && at203 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto space-y-4"
        >
          {/* AT-203 diff */}
          <div className="p-4 bg-ordino-bg rounded-xl border border-ordino-warning/30 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-ordino-warning" />
              <span className="text-xs font-semibold text-ordino-warning">AT-203 — Proposed Patch</span>
              <span className="ml-auto text-xs text-ordino-text-muted">Confidence: 71/100</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] font-semibold text-ordino-error mb-1 uppercase tracking-wide">Before</p>
                <div className="bg-ordino-card rounded-lg border border-ordino-error/20 p-2 font-mono text-[10px] space-y-0.5">
                  {at203.before.map((line, li) => (
                    <div key={li} className="text-ordino-error/80 leading-relaxed">{line}</div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-ordino-success mb-1 uppercase tracking-wide">After</p>
                <div className="bg-ordino-card rounded-lg border border-ordino-success/20 p-2 font-mono text-[10px] space-y-0.5">
                  {at203.after.map((line, li) => (
                    <div key={li} className="text-ordino-success/90 leading-relaxed">{line}</div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-ordino-text-muted">{at203.explanation}</p>
          </div>

          {/* Awaiting state + button */}
          <div className="p-4 bg-ordino-warning/10 rounded-xl border border-ordino-warning/30">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-ordino-warning" />
              <p className="text-sm font-semibold text-ordino-warning">Awaiting QA Approval</p>
            </div>
            <p className="text-xs text-ordino-text-muted mb-4">
              @alex.nguyen and @priya.sharma have been notified. Review the AT-203 patch above and click below to approve.
            </p>
            <div className="flex justify-center">
              <Button onClick={onApprove} size="lg">
                <CheckCircle size={18} />
                Simulate QA Approval
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
