import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle, XCircle } from 'lucide-react';
import { testClassifications } from '../../../../data/autoHealMockData';

export function FailureClassification() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Phase 0 → 1: analyzing (1.8s)
  useEffect(() => {
    if (currentPhase !== 0) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(1);
    }, 1800);
    return () => clearTimeout(t);
  }, [currentPhase]);

  // Phase 1 → 2: results appear (1.5s)
  useEffect(() => {
    if (currentPhase !== 1) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(2);
    }, 1500);
    return () => clearTimeout(t);
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
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
          animate={currentPhase < 2 ? { rotate: [0, 360] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Cpu size={32} className="text-ordino-primary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {currentPhase === 0 ? 'Running Classification Engine...' : 'Failures Classified'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {currentPhase === 0
            ? 'Analyzing error patterns, DOM state, and API contracts'
            : '3 failure categories identified with confidence scores'}
        </p>
      </div>

      {/* Phase 0: processing shimmer */}
      {currentPhase === 0 && (
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-3">
              <div className="h-3 w-24 bg-ordino-border rounded animate-pulse" />
              <div className="h-2 bg-ordino-border/60 rounded animate-pulse" />
              <div className="h-2 bg-ordino-border/60 rounded animate-pulse w-3/4" />
              <div className="h-6 w-16 bg-ordino-border rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Phase 1+: classification cards */}
      {currentPhase >= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {testClassifications.map((cls, i) => {
            const cc = confidenceColor(cls.confidence);
            return (
              <motion.div
                key={cls.testId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-3"
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ordino-text font-mono">{cls.testId}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-${cc}/20 text-${cc} border border-${cc}/30 font-semibold`}>
                    {cls.confidence}/100
                  </span>
                </div>

                {/* Category badge */}
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg bg-${cc}/10 text-${cc} border border-${cc}/20 text-center`}>
                  {cls.category}
                </div>

                {/* Sub-checks */}
                <div className="space-y-1.5">
                  {cls.checks.map((check, ci) => (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 + ci * 0.1 + 0.3 }}
                      className="flex items-start gap-1.5"
                    >
                      {check.passed ? (
                        <CheckCircle size={12} className="text-ordino-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={12} className="text-ordino-error flex-shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[11px] text-ordino-text-muted leading-tight">{check.label}</p>
                        <p className="text-[11px] text-ordino-text font-mono truncate">{check.result}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Strategy */}
                {currentPhase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-2 border-t border-ordino-border"
                  >
                    <p className="text-[11px] text-ordino-text-muted">Proposed fix:</p>
                    <p className="text-[11px] text-ordino-text font-medium">{cls.strategy}</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
