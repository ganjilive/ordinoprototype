import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock, Users } from 'lucide-react';
import { Button } from '../../../common';
import { slackMessages } from '../../../../data/rcaMockData';

interface HumanCollaborationRequestProps {
  onCollaborationComplete: () => void;
}

export function HumanCollaborationRequest({ onCollaborationComplete }: HumanCollaborationRequestProps) {
  const [phase, setPhase] = useState(0);
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Phase 0: composing (2s) → phase 1
  useEffect(() => {
    if (phase !== 0) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase(1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 1: send messages with stagger → phase 2
  useEffect(() => {
    if (phase !== 1) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    slackMessages.forEach((msg, index) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        setSentMessages(prev => [...prev, msg.id]);
      }, index * 500);
      timers.push(t);
    });

    const done = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase(2);
    }, slackMessages.length * 500 + 500);
    timers.push(done);

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
          animate={phase < 2 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {phase >= 2 ? (
            <Clock size={32} className="text-ordino-warning" />
          ) : (
            <MessageSquare size={32} className="text-ordino-secondary" />
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {phase === 0 ? 'Composing Messages...' : phase === 1 ? 'Sending Messages...' : 'Awaiting Human Response'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase < 2
            ? 'Notifying QA Lead, Backend Engineer, and team channel'
            : 'Workflow paused — waiting for team confirmation'}
        </p>
      </div>

      {/* Phase 0: shimmer composing cards */}
      {phase === 0 && (
        <div className="max-w-lg mx-auto space-y-3">
          {slackMessages.map((msg) => (
            <div key={msg.id} className="p-4 bg-ordino-bg rounded-xl border border-ordino-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <MessageSquare size={16} className="text-pink-400" />
                </div>
                <div>
                  <div className="h-3 w-24 bg-ordino-border rounded animate-pulse" />
                  <div className="h-2 w-16 bg-ordino-border/60 rounded animate-pulse mt-1" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-ordino-border rounded animate-pulse" />
                <div className="h-2 bg-ordino-border rounded animate-pulse w-4/5" />
                <div className="h-2 bg-ordino-border rounded animate-pulse w-3/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phase 1 & 2: sent message cards */}
      {phase >= 1 && (
        <div className="max-w-lg mx-auto space-y-3">
          <AnimatePresence>
            {slackMessages.map((msg) => {
              const isSent = sentMessages.includes(msg.id);
              if (!isSent && phase === 1) return null;
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

      {/* Phase 2: awaiting state + button */}
      {phase === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <div className="p-4 bg-ordino-warning/10 rounded-xl border border-ordino-warning/30 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-ordino-warning" />
              <p className="text-sm font-semibold text-ordino-warning">Awaiting Team Response</p>
            </div>
            <p className="text-xs text-ordino-text-muted">
              Messages sent to @sarah.chen, @dev-backend, @david.park, and #qa-engineers.
              Click below once the team has responded to proceed with RCA completion.
            </p>
          </div>

          <div className="flex justify-center">
            <Button onClick={onCollaborationComplete} size="lg">
              <CheckCircle size={18} />
              Simulate Responses Received
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
