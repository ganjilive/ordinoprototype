import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Clock } from 'lucide-react';
import { failingTests } from '../../../../data/autoHealMockData';

const errorTypeColor: Record<string, string> = {
  ElementNotFoundError: 'ordino-warning',
  AssertionError: 'ordino-primary',
  TimeoutError: 'ordino-error',
};

export function FailureDetected() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Phase 0 → 1: alert ingestion (1.5s)
  useEffect(() => {
    if (currentPhase !== 0) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(1);
    }, 1500);
    return () => clearTimeout(t);
  }, [currentPhase]);

  // Phase 1: stagger in failure cards, then → phase 2
  useEffect(() => {
    if (currentPhase !== 1) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    failingTests.forEach((test, i) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        setVisibleCards((prev) => [...prev, test.id]);
      }, i * 500);
      timers.push(t);
    });

    const done = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(2);
    }, failingTests.length * 500 + 400);
    timers.push(done);

    return () => timers.forEach(clearTimeout);
  }, [currentPhase]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-error/20 flex items-center justify-center"
          animate={currentPhase < 2 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <AlertTriangle size={32} className="text-ordino-error" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {currentPhase === 0 ? 'Ingesting CI Alert...' : 'Failure Alert Received'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {currentPhase === 0
            ? 'CI pipeline triggered — scanning for failures'
            : '3 automated tests failed in latest pipeline run'}
        </p>
      </div>

      {/* Phase 0: pulsing skeleton */}
      {currentPhase === 0 && (
        <div className="max-w-xl mx-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-ordino-bg rounded-xl border border-ordino-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-ordino-border animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-ordino-border rounded animate-pulse" />
                  <div className="h-2 w-20 bg-ordino-border/60 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-2 bg-ordino-border rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Phase 1+: failure cards */}
      {currentPhase >= 1 && (
        <div className="max-w-xl mx-auto space-y-3">
          <AnimatePresence>
            {failingTests.map((test) => {
              if (!visibleCards.includes(test.id)) return null;
              const colorKey = errorTypeColor[test.errorType] ?? 'ordino-error';
              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-ordino-bg rounded-xl border border-ordino-border"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${colorKey}/20 flex items-center justify-center flex-shrink-0`}>
                      <XCircle size={16} className={`text-${colorKey}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-ordino-text font-mono">{test.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-${colorKey}/20 text-${colorKey} border border-${colorKey}/30`}>
                          {test.errorType}
                        </span>
                        <span className="ml-auto flex items-center gap-1 text-xs text-ordino-text-muted">
                          <Clock size={11} />
                          {test.duration}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-ordino-text-muted truncate">{test.errorMessage}</p>
                      <p className="text-xs text-ordino-text-muted mt-1">
                        {test.file}:{test.line} · last passed {test.lastPassed}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Phase 2: summary bar */}
      {currentPhase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto p-3 bg-ordino-error/10 rounded-xl border border-ordino-error/30 flex items-center gap-3"
        >
          <AlertTriangle size={16} className="text-ordino-error flex-shrink-0" />
          <p className="text-xs text-ordino-text-muted">
            <span className="text-ordino-error font-semibold">3 failures detected</span> — Ordino is initiating automated healing analysis.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
