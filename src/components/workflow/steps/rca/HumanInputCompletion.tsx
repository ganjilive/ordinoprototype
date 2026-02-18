import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, Loader2 } from 'lucide-react';
import { humanResponses, rcaReport } from '../../../../data/rcaMockData';

export function HumanInputCompletion() {
  const [visibleResponses, setVisibleResponses] = useState<string[]>([]);
  const [synthesisProgress, setSynthesisProgress] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [phase, setPhase] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Phase 0: stagger response cards (700ms each)
  useEffect(() => {
    if (phase !== 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    humanResponses.forEach((resp, index) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        setVisibleResponses(prev => [...prev, resp.id]);
      }, index * 700);
      timers.push(t);
    });

    const nextPhase = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase(1);
    }, humanResponses.length * 700 + 400);
    timers.push(nextPhase);

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Phase 1: progress bar 0→100%
  useEffect(() => {
    if (phase !== 1) return;
    const interval = setInterval(() => {
      setSynthesisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    const done = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase(2);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [phase]);

  // Phase 2: show report preview
  useEffect(() => {
    if (phase !== 2) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setShowReport(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-success/20 flex items-center justify-center">
          {phase >= 2 ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle size={32} className="text-ordino-success" />
            </motion.div>
          ) : (
            <Loader2 size={32} className="text-ordino-primary animate-spin" />
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {phase < 2 ? 'Processing Human Input...' : 'Input Synthesized'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase < 2 ? 'Incorporating team responses into RCA findings' : 'RCA report ready for finalization'}
        </p>
      </div>

      {/* Human response cards */}
      <div className="max-w-lg mx-auto space-y-3">
        <AnimatePresence>
          {humanResponses.map((resp) => {
            if (!visibleResponses.includes(resp.id)) return null;
            return (
              <motion.div
                key={resp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-ordino-bg rounded-xl border border-ordino-success/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-ordino-success/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-ordino-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-ordino-text">{resp.from}</span>
                      <span className="text-xs text-ordino-text-muted">{resp.role}</span>
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-ordino-success/20 text-ordino-success border border-ordino-success/30">
                        Response Received
                      </span>
                    </div>
                    <p className="text-xs text-ordino-text-muted leading-relaxed">{resp.message}</p>
                    <p className="text-[10px] text-ordino-text-muted/60 mt-1">{resp.timestamp}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Synthesis progress bar */}
      {phase >= 1 && phase < 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto">
          <div className="flex justify-between text-xs text-ordino-text-muted mb-1">
            <span>Synthesizing human input with findings</span>
            <span>{synthesisProgress}%</span>
          </div>
          <div className="h-2 bg-ordino-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-ordino-primary to-ordino-success"
              animate={{ width: `${synthesisProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}

      {/* RCA Report preview */}
      {showReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto p-4 bg-ordino-primary/10 rounded-xl border border-ordino-primary/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-ordino-primary" />
            <h4 className="text-sm font-semibold text-ordino-text">RCA Report Preview</h4>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-ordino-primary/20 text-ordino-primary border border-ordino-primary/30">
              {rcaReport.id}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Root Cause', value: rcaReport.rootCause.title },
              { label: 'Resolution Steps', value: `${rcaReport.resolutionSteps.length} actions identified` },
              { label: 'Prevention', value: `${rcaReport.preventionRecommendations.length} recommendations` },
              { label: 'Severity', value: rcaReport.severity },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2 text-xs">
                <span className="text-ordino-text-muted w-28 flex-shrink-0">{item.label}:</span>
                <span className="text-ordino-text">{item.value}</span>
              </div>
            ))}
          </div>

          {/* 5 Whys Analysis */}
          <div className="mt-3 pt-3 border-t border-ordino-primary/20">
            <p className="text-xs font-semibold text-ordino-text-muted mb-2">5 Whys Analysis</p>
            <div className="space-y-1.5">
              {rcaReport.fiveWhys.map((entry, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <span className="text-ordino-primary flex-shrink-0">{['①','②','③','④','⑤'][index]}</span>
                  <span className="text-ordino-text-muted">{entry.why}</span>
                  <span className="text-ordino-text-muted mx-1">→</span>
                  <span className="text-ordino-text">{entry.answer}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
