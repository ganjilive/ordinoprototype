import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, User, Calendar, Link } from 'lucide-react';
import { changeCorrelations } from '../../../../data/autoHealMockData';

export function ChangeCorrelation() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Phase 0 → 1: scanning git history (2s)
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

  const diffLineStyle = (type: string) => {
    switch (type) {
      case 'add': return 'bg-ordino-success/10 text-ordino-success';
      case 'remove': return 'bg-ordino-error/10 text-ordino-error';
      default: return 'text-ordino-text-muted';
    }
  };

  const diffPrefix = (type: string) => {
    if (type === 'add') return '+';
    if (type === 'remove') return '-';
    return ' ';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
          animate={currentPhase === 0 ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <GitBranch size={32} className="text-ordino-secondary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {currentPhase === 0 ? 'Scanning Git History...' : 'Causal Commits Found'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {currentPhase === 0
            ? 'Correlating test failures to recent code changes'
            : '3 commits matched to failure root causes'}
        </p>
      </div>

      {/* Phase 0: scanning shimmer */}
      {currentPhase === 0 && (
        <div className="max-w-xl mx-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-2">
              <div className="h-3 w-48 bg-ordino-border rounded animate-pulse" />
              <div className="h-2 w-full bg-ordino-border/60 rounded animate-pulse" />
              <div className="h-2 w-3/4 bg-ordino-border/60 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Phase 1: tabbed commit correlations */}
      {currentPhase >= 1 && (
        <div className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {changeCorrelations.map((corr, i) => (
              <button
                key={corr.testId}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex-shrink-0 ${
                  activeTab === i
                    ? 'bg-ordino-primary/20 text-ordino-primary border-ordino-primary/40'
                    : 'bg-ordino-bg text-ordino-text-muted border-ordino-border hover:text-ordino-text'
                }`}
              >
                {corr.testId}
              </button>
            ))}
          </div>

          {/* Active correlation card */}
          {changeCorrelations.map((corr, i) => {
            if (i !== activeTab) return null;
            const cc = confidenceColor(corr.causalConfidence);
            return (
              <motion.div
                key={corr.testId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-4"
              >
                {/* Commit meta */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-ordino-primary">{corr.commitHash}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-${cc}/20 text-${cc} border border-${cc}/30 font-semibold ml-auto`}>
                      <Link size={10} className="inline mr-1" />
                      {corr.causalConfidence}% causal
                    </span>
                  </div>
                  <p className="text-sm text-ordino-text font-medium">{corr.commitMessage}</p>
                  <div className="flex items-center gap-4 text-xs text-ordino-text-muted">
                    <span className="flex items-center gap-1">
                      <User size={11} />
                      {corr.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {corr.timestamp}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-ordino-text-muted">{corr.file}</p>
                </div>

                {/* Git diff */}
                <div className="bg-ordino-card rounded-lg border border-ordino-border overflow-hidden">
                  <div className="px-3 py-2 bg-ordino-bg border-b border-ordino-border">
                    <span className="text-xs text-ordino-text-muted font-mono">diff --git</span>
                  </div>
                  <div className="p-3 font-mono text-xs space-y-0.5">
                    {corr.diff.map((line, li) => (
                      <div key={li} className={`px-2 py-0.5 rounded ${diffLineStyle(line.type)}`}>
                        <span className="select-none mr-2 opacity-60">{diffPrefix(line.type)}</span>
                        {line.content}
                      </div>
                    ))}
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
