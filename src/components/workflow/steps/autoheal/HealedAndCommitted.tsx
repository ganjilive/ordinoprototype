import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitMerge, CheckCircle, Zap } from 'lucide-react';
import { healingCommits, healingSummary } from '../../../../data/autoHealMockData';

export function HealedAndCommitted() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [visiblePRs, setVisiblePRs] = useState<string[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Phase 0 → 1: committing (1.5s)
  useEffect(() => {
    if (currentPhase !== 0) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(1);
    }, 1500);
    return () => clearTimeout(t);
  }, [currentPhase]);

  // Phase 1: stagger PR cards → phase 2
  useEffect(() => {
    if (currentPhase !== 1) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    healingCommits.forEach((commit, i) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        setVisiblePRs((prev) => [...prev, commit.testId]);
      }, i * 500);
      timers.push(t);
    });

    const done = setTimeout(() => {
      if (!mountedRef.current) return;
      setCurrentPhase(2);
    }, healingCommits.length * 500 + 400);
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
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-success/20 flex items-center justify-center"
          animate={currentPhase === 0 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {currentPhase >= 1 ? (
            <Zap size={32} className="text-ordino-success" />
          ) : (
            <GitMerge size={32} className="text-ordino-success" />
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {currentPhase === 0 ? 'Committing Healed Tests...' : 'All Tests Healed & Committed'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {currentPhase === 0
            ? 'Creating branches and opening pull requests'
            : '3 PRs opened, CI re-running — all green'}
        </p>
      </div>

      {/* Phase 0: shimmer */}
      {currentPhase === 0 && (
        <div className="max-w-xl mx-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-ordino-bg rounded-xl border border-ordino-border space-y-2">
              <div className="h-3 w-40 bg-ordino-border rounded animate-pulse" />
              <div className="h-2 w-full bg-ordino-border/60 rounded animate-pulse" />
              <div className="h-2 w-3/4 bg-ordino-border/60 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Phase 1+: PR cards */}
      {currentPhase >= 1 && (
        <div className="max-w-xl mx-auto space-y-3">
          {healingCommits.map((commit) => {
            if (!visiblePRs.includes(commit.testId)) return null;
            const cc = confidenceColor(commit.confidence);
            return (
              <motion.div
                key={commit.testId}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-ordino-bg rounded-xl border border-ordino-border"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ordino-success/20 flex items-center justify-center flex-shrink-0">
                    <GitMerge size={16} className="text-ordino-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-ordino-text font-mono">{commit.prNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-${cc}/20 text-${cc} border border-${cc}/30`}>
                        {commit.healingStrategy}
                      </span>
                      <span className={`ml-auto text-xs font-semibold text-ordino-${commit.ciStatus === 'passing' ? 'success' : 'warning'} flex items-center gap-1`}>
                        <CheckCircle size={11} />
                        CI {commit.ciStatus}
                      </span>
                    </div>
                    <p className="text-xs text-ordino-text">{commit.prTitle}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-ordino-text-muted">
                      <span className="font-mono">{commit.branch}</span>
                      <span>{commit.jiraTicket}</span>
                      <span>{commit.autoCommitted ? 'Auto-committed' : 'Approved by QA'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Phase 2: healing summary table */}
      {currentPhase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <h4 className="text-sm font-semibold text-ordino-text mb-3">Healing Summary</h4>
          <div className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ordino-border bg-ordino-card/50">
                  <th className="text-left px-4 py-2.5 text-ordino-text-muted font-medium">Test</th>
                  <th className="text-left px-4 py-2.5 text-ordino-text-muted font-medium">Error</th>
                  <th className="text-left px-4 py-2.5 text-ordino-text-muted font-medium">Strategy</th>
                  <th className="text-right px-4 py-2.5 text-ordino-text-muted font-medium">Score</th>
                  <th className="text-right px-4 py-2.5 text-ordino-text-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {healingSummary.map((row, i) => {
                  const cc = confidenceColor(row.confidence);
                  return (
                    <motion.tr
                      key={row.testId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b border-ordino-border/50 last:border-0"
                    >
                      <td className="px-4 py-2.5 font-mono font-semibold text-ordino-text">{row.testId}</td>
                      <td className="px-4 py-2.5 text-ordino-text-muted">{row.errorType}</td>
                      <td className="px-4 py-2.5 text-ordino-text">{row.strategy}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`font-semibold text-${cc}`}>{row.confidence}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.status === 'healed'
                            ? 'bg-ordino-success/20 text-ordino-success border border-ordino-success/30'
                            : 'bg-ordino-primary/20 text-ordino-primary border border-ordino-primary/30'
                        }`}>
                          {row.status === 'healed' ? 'Auto-healed' : 'QA-approved'}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
