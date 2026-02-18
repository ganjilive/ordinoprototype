import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, XCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import { failingBuilds } from '../../../../data/rcaMockData';

export function FailurePatternDetection() {
  const [phase, setPhase] = useState(0);
  const [visibleBuilds, setVisibleBuilds] = useState<number[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Phase 0: scanning → phase 1
  useEffect(() => {
    if (phase !== 0) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase(1);
    }, 1800);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 1: stagger build cards
  useEffect(() => {
    if (phase !== 1) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    failingBuilds.forEach((build, index) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return;
        setVisibleBuilds(prev => [...prev, build.buildNumber]);
        if (index === failingBuilds.length - 1) {
          const t2 = setTimeout(() => {
            if (!mountedRef.current) return;
            setPhase(2);
          }, 600);
          timers.push(t2);
        }
      }, index * 600);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Phase 2: show pattern banner
  useEffect(() => {
    if (phase !== 2) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setShowBanner(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div key="scanning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center space-y-4">
            <motion.div
              className="w-16 h-16 mx-auto rounded-full bg-ordino-secondary/20 flex items-center justify-center"
              animate={{ boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.4)', '0 0 20px 10px rgba(59, 130, 246, 0)'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div animate={{ rotate: [0, 30, -30, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Search size={32} className="text-ordino-secondary" />
              </motion.div>
            </motion.div>
            <h3 className="text-lg font-semibold text-ordino-text">Scanning Build History</h3>
            <p className="text-sm text-ordino-text-muted">Analyzing last 10 builds for recurring failure patterns...</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ordino-card rounded-full border border-ordino-border">
              <span className="w-2 h-2 rounded-full bg-ordino-secondary animate-pulse" />
              <span className="text-xs text-ordino-text-muted">Querying CI history...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-base font-semibold text-ordino-text">Consecutive Failures Detected</h3>
            <p className="text-sm text-ordino-text-muted">TC-042 "User Authentication Timeout" — 3 consecutive builds</p>
          </div>

          <div className="max-w-lg mx-auto space-y-3">
            <AnimatePresence>
              {failingBuilds.map((build) => {
                if (!visibleBuilds.includes(build.buildNumber)) return null;
                return (
                  <motion.div
                    key={build.buildNumber}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-ordino-error/10 rounded-xl border border-ordino-error/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-ordino-error/20 flex items-center justify-center flex-shrink-0">
                        <XCircle size={20} className="text-ordino-error" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-ordino-error">Build #{build.buildNumber}</span>
                          <span className="text-xs text-ordino-text-muted font-mono">{build.commitHash}</span>
                        </div>
                        <p className="text-xs text-ordino-text font-medium">{build.failedTest} — FAILED</p>
                        <p className="text-xs text-ordino-text-muted mt-0.5 font-mono">{build.errorMessage}</p>
                        <p className="text-xs text-ordino-text-muted mt-1">{build.timestamp}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto"
            >
              {/* Mini frequency chart */}
              <div className="p-4 bg-ordino-card rounded-xl border border-ordino-border mb-3">
                <p className="text-xs text-ordino-text-muted mb-2 font-medium uppercase tracking-wider">Failure Frequency — Last 5 Builds</p>
                <div className="flex items-end gap-2 h-12">
                  {[0, 0, 1, 1, 1].map((failed, i) => (
                    <motion.div
                      key={i}
                      className={`flex-1 rounded-sm ${failed ? 'bg-ordino-error' : 'bg-ordino-success'}`}
                      initial={{ height: 0 }}
                      animate={{ height: failed ? '100%' : '40%' }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-ordino-text-muted mt-1">
                  <span>#46</span><span>#47</span><span>#48</span><span>#49</span><span>#50</span>
                </div>
              </div>

              <div className="p-4 bg-ordino-warning/10 rounded-xl border border-ordino-warning/30 flex items-start gap-3">
                <AlertTriangle size={20} className="text-ordino-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-ordino-text">Pattern Detected</p>
                  <p className="text-xs text-ordino-text-muted mt-1">
                    TC-042 has failed in 3 consecutive builds with identical assertion error.
                    Initiating automated RCA...
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingDown size={14} className="text-ordino-error" />
                    <span className="text-xs text-ordino-error font-medium">Non-flaky failure — systematic root cause suspected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
