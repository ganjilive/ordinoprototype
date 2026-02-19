import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle, AlertCircle } from 'lucide-react';
import { healingStrategies } from '../../../../data/autoHealMockData';

export function HealingStrategySelected() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Phase 0 → 1: strategy selection (2s)
  useEffect(() => {
    if (currentPhase !== 0) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(1);
    }, 2000);
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
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-success/20 flex items-center justify-center"
          animate={currentPhase === 0 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Wrench size={32} className="text-ordino-success" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {currentPhase === 0 ? 'Selecting Healing Strategies...' : 'Healing Strategies Ready'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {currentPhase === 0
            ? 'Generating minimal diffs for each repair'
            : 'Before/after patches prepared for sandbox validation'}
        </p>
      </div>

      {/* Phase 0: shimmer */}
      {currentPhase === 0 && (
        <div className="max-w-2xl mx-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-3">
              <div className="h-3 w-40 bg-ordino-border rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-ordino-border/60 rounded animate-pulse" />
                <div className="h-16 bg-ordino-border/60 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phase 1: strategy cards */}
      {currentPhase >= 1 && (
        <div className="max-w-2xl mx-auto space-y-4">
          {healingStrategies.map((strategy, i) => {
            const cc = confidenceColor(strategy.confidence);
            return (
              <motion.div
                key={strategy.testId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-3"
              >
                {/* Card header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-ordino-text font-mono">{strategy.testId}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-${cc}/20 text-${cc} border border-${cc}/30 font-semibold`}>
                    {strategy.strategyName}
                  </span>
                  <span className={`text-xs font-semibold text-${cc} ml-auto`}>
                    {strategy.confidence}/100
                  </span>
                  {strategy.autoApprove ? (
                    <span className="flex items-center gap-1 text-xs text-ordino-success">
                      <CheckCircle size={12} />
                      Auto-commit
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-ordino-warning">
                      <AlertCircle size={12} />
                      Needs review
                    </span>
                  )}
                </div>

                <p className="text-xs text-ordino-text-muted">{strategy.explanation}</p>

                {/* Before / After */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold text-ordino-error mb-1 uppercase tracking-wide">Before</p>
                    <div className="bg-ordino-card rounded-lg border border-ordino-error/20 p-2.5 font-mono text-[11px] space-y-0.5">
                      {strategy.before.map((line, li) => (
                        <div key={li} className="text-ordino-error/80 leading-relaxed">{line}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-ordino-success mb-1 uppercase tracking-wide">After</p>
                    <div className="bg-ordino-card rounded-lg border border-ordino-success/20 p-2.5 font-mono text-[11px] space-y-0.5">
                      {strategy.after.map((line, li) => (
                        <div key={li} className="text-ordino-success/90 leading-relaxed">{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
