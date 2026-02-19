import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, CheckCircle, Clock } from 'lucide-react';
import { sandboxResults } from '../../../../data/autoHealMockData';

export function SandboxValidation() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [runningStages, setRunningStages] = useState<Record<string, number>>({});
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Phase 0 → 1: start pipeline runs (1.5s)
  useEffect(() => {
    if (currentPhase !== 0) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(1);
    }, 1500);
    return () => clearTimeout(t);
  }, [currentPhase]);

  // Phase 1: advance pipeline stages per test
  useEffect(() => {
    if (currentPhase !== 1) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    sandboxResults.forEach((result) => {
      result.pipelineStages.forEach((_, si) => {
        const t = setTimeout(() => {
          if (!mountedRef.current) return;
          setRunningStages((prev) => ({
            ...prev,
            [result.testId]: si + 1,
          }));
        }, si * 400 + 300);
        timers.push(t);
      });
    });

    const done = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(2);
    }, sandboxResults[0].pipelineStages.length * 400 + 700);
    timers.push(done);

    return () => timers.forEach(clearTimeout);
  }, [currentPhase]);

  const confidenceColor = (score: number) => {
    if (score >= 90) return 'ordino-success';
    if (score >= 80) return 'ordino-primary';
    return 'ordino-warning';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
          animate={currentPhase < 2 ? { rotate: [0, 360] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <FlaskConical size={32} className="text-ordino-secondary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {currentPhase < 2 ? 'Running Sandbox Validation...' : 'Sandbox Validation Complete'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {currentPhase < 2
            ? 'Applying patches in isolated environment and re-running tests'
            : 'All healed tests pass — confidence scores confirmed'}
        </p>
      </div>

      {/* Phase 0: shimmer */}
      {currentPhase === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-3">
              <div className="h-3 w-16 bg-ordino-border rounded animate-pulse" />
              <div className="space-y-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-ordino-border animate-pulse" />
                    <div className="h-2 flex-1 bg-ordino-border/60 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phase 1+: pipeline columns */}
      {currentPhase >= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {sandboxResults.map((result, ri) => {
            const cc = confidenceColor(result.healingScore);
            const completedCount = runningStages[result.testId] ?? 0;

            return (
              <motion.div
                key={result.testId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ri * 0.1 }}
                className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-3"
              >
                {/* Test ID + duration */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ordino-text font-mono">{result.testId}</span>
                  <span className="flex items-center gap-1 text-xs text-ordino-text-muted">
                    <Clock size={11} />
                    {result.duration}
                  </span>
                </div>

                {/* Pipeline stages */}
                <div className="space-y-1.5">
                  {result.pipelineStages.map((stage, si) => {
                    const isDone = completedCount > si;
                    return (
                      <AnimatePresence key={si}>
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle size={14} className="text-ordino-success" />
                            </motion.div>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-ordino-border flex-shrink-0" />
                          )}
                          <span className={`text-xs ${isDone ? 'text-ordino-text' : 'text-ordino-text-muted'}`}>
                            {stage.label}
                          </span>
                        </div>
                      </AnimatePresence>
                    );
                  })}
                </div>

                {/* Healing score */}
                {currentPhase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`pt-2 border-t border-ordino-border flex items-center justify-between`}
                  >
                    <span className="text-xs text-ordino-text-muted">Healing score</span>
                    <span className={`text-sm font-bold text-${cc}`}>{result.healingScore}/100</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Phase 2: summary */}
      {currentPhase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto p-3 bg-ordino-success/10 rounded-xl border border-ordino-success/30 flex items-center gap-3"
        >
          <CheckCircle size={16} className="text-ordino-success flex-shrink-0" />
          <p className="text-xs text-ordino-text-muted">
            <span className="text-ordino-success font-semibold">AT-112 (96) and AT-089 (88)</span> cleared for auto-commit.{' '}
            <span className="text-ordino-warning font-semibold">AT-203 (71)</span> flagged for human review.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
