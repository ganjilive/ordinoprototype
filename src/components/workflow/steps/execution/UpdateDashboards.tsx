import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, LayoutDashboard, TrendingUp, Bug, Target, ExternalLink } from 'lucide-react';
import { Badge } from '../../../common';
import { dashboardMetrics } from '../../../../data/testExecutionMockData';

const phaseLabels = ['Syncing', 'Updating', 'Complete'];

const integrations = [
  { id: 'testrail', name: 'TestRail', icon: '🧪' },
  { id: 'jira', name: 'Jira', icon: '📋' },
  { id: 'slack', name: 'Slack', icon: '💬' },
];

export function UpdateDashboards() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [syncedIntegrations, setSyncedIntegrations] = useState<string[]>([]);
  const [metricsProgress, setMetricsProgress] = useState(0);
  const mountedRef = useRef(true);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, []);

  // Phase 0: Syncing integrations
  useEffect(() => {
    if (currentPhase !== 0 || completedPhases.includes(0)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;
    const syncNext = () => {
      if (!mountedRef.current) return;
      if (index < integrations.length) {
        const integration = integrations[index];
        if (!integration) return;
        const timer = setTimeout(() => {
          if (!mountedRef.current) return;
          setSyncedIntegrations(prev => [...prev, integration.id]);
          index++;
          syncNext();
        }, 1200);
        phaseTimers.push(timer);
      } else {
        setCompletedPhases(prev => [...prev, 0]);
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          transitionTimerRef.current = null;
          setCurrentPhase(1);
        }, 3000);
      }
    };

    const startTimer = setTimeout(syncNext, 800);
    phaseTimers.push(startTimer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  // Phase 1: Updating metrics
  useEffect(() => {
    if (currentPhase !== 1 || completedPhases.includes(1)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    let progress = 0;
    const updateProgress = () => {
      if (!mountedRef.current) return;
      if (progress < 100) {
        progress += 10;
        setMetricsProgress(progress);
        const timer = setTimeout(updateProgress, 250);
        phaseTimers.push(timer);
      } else {
        setCompletedPhases(prev => [...prev, 1]);
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          transitionTimerRef.current = null;
          setCurrentPhase(2);
        }, 3000);
      }
    };

    const startTimer = setTimeout(updateProgress, 500);
    phaseTimers.push(startTimer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  // Phase 2: Complete
  useEffect(() => {
    if (currentPhase !== 2 || completedPhases.includes(2)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setCompletedPhases(prev => [...prev, 2]);
    }, 1500);
    phaseTimers.push(timer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  const interpolateValue = (before: number, after: number) => {
    const progress = metricsProgress / 100;
    return before + (after - before) * progress;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Phase Progress Indicator */}
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
        {phaseLabels.map((label, index) => {
          const isDone = completedPhases.includes(index);
          const isActive = currentPhase === index && !isDone;

          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    isDone
                      ? 'bg-ordino-success/20 border-ordino-success text-ordino-success'
                      : isActive
                        ? 'bg-ordino-primary/20 border-ordino-primary text-ordino-primary'
                        : 'bg-ordino-card border-ordino-border text-ordino-text-muted'
                  }`}
                  animate={isActive ? {
                    boxShadow: [
                      '0 0 0 0 rgba(249, 115, 22, 0.3)',
                      '0 0 12px 4px rgba(249, 115, 22, 0)',
                    ],
                  } : {}}
                  transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  {isDone ? <CheckCircle size={16} /> : index + 1}
                </motion.div>
                <span className={`text-[10px] font-medium whitespace-nowrap ${
                  isDone
                    ? 'text-ordino-success'
                    : isActive
                      ? 'text-ordino-primary'
                      : 'text-ordino-text-muted'
                }`}>
                  {label}
                </span>
              </div>
              {index < phaseLabels.length - 1 && (
                <div className="h-0.5 w-6 bg-ordino-border rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-ordino-success"
                    initial={{ width: '0%' }}
                    animate={{ width: isDone ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Phase 0: Syncing */}
        {currentPhase === 0 && !completedPhases.includes(0) && (
          <motion.div
            key="syncing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.4)',
                    '0 0 20px 10px rgba(59, 130, 246, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <LayoutDashboard size={32} className="text-ordino-secondary" />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Syncing Integrations</h3>
              <p className="text-sm text-ordino-text-muted">
                Updating connected tools with test results
              </p>
            </div>

            <div className="flex justify-center gap-4 max-w-md mx-auto">
              {integrations.map((integration) => {
                const isSynced = syncedIntegrations.includes(integration.id);

                return (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex-1 text-center p-4 rounded-xl border ${
                      isSynced
                        ? 'bg-ordino-success/10 border-ordino-success/30'
                        : 'bg-ordino-bg border-ordino-border'
                    }`}
                  >
                    <div className="text-3xl mb-2">{integration.icon}</div>
                    <p className={`text-sm font-medium ${
                      isSynced ? 'text-ordino-success' : 'text-ordino-text'
                    }`}>
                      {integration.name}
                    </p>
                    <div className="mt-2">
                      {isSynced ? (
                        <Badge variant="success" size="sm">Synced</Badge>
                      ) : (
                        <Loader2 size={16} className="text-ordino-text-muted animate-spin mx-auto" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Phase 1: Updating metrics */}
        {currentPhase === 1 && !completedPhases.includes(1) && (
          <motion.div
            key="updating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(249, 115, 22, 0.4)',
                    '0 0 20px 10px rgba(249, 115, 22, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <TrendingUp size={32} className="text-ordino-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Updating Metrics</h3>
              <p className="text-sm text-ordino-text-muted">
                Refreshing dashboard data
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="p-4 rounded-xl border bg-ordino-bg border-ordino-border">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={16} className="text-ordino-secondary" />
                  <span className="text-xs text-ordino-text-muted">Pass Rate</span>
                </div>
                <p className="text-2xl font-bold text-ordino-text">
                  {interpolateValue(dashboardMetrics.before.passRate, dashboardMetrics.after.passRate).toFixed(1)}%
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-ordino-bg border-ordino-border">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-ordino-success" />
                  <span className="text-xs text-ordino-text-muted">Total Tests</span>
                </div>
                <p className="text-2xl font-bold text-ordino-text">
                  {Math.round(interpolateValue(dashboardMetrics.before.totalTests, dashboardMetrics.after.totalTests))}
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-ordino-bg border-ordino-border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-ordino-primary" />
                  <span className="text-xs text-ordino-text-muted">Coverage</span>
                </div>
                <p className="text-2xl font-bold text-ordino-text">
                  {interpolateValue(dashboardMetrics.before.coverage, dashboardMetrics.after.coverage).toFixed(1)}%
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-ordino-bg border-ordino-border">
                <div className="flex items-center gap-2 mb-2">
                  <Bug size={16} className="text-ordino-error" />
                  <span className="text-xs text-ordino-text-muted">Open Bugs</span>
                </div>
                <p className="text-2xl font-bold text-ordino-text">
                  {Math.round(interpolateValue(dashboardMetrics.before.openBugs, dashboardMetrics.after.openBugs))}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between text-xs text-ordino-text-muted mb-1">
                <span>Updating...</span>
                <span>{metricsProgress}%</span>
              </div>
              <div className="h-2 bg-ordino-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-ordino-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${metricsProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Complete */}
        {currentPhase === 2 && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-success/20 flex items-center justify-center"
              >
                <CheckCircle size={32} className="text-ordino-success" />
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Dashboards Updated</h3>
              <p className="text-sm text-ordino-text-muted">
                All metrics synced across {integrations.length} integrations
              </p>
            </div>

            {/* Final Metrics */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl border bg-ordino-bg border-ordino-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ordino-text-muted">Pass Rate</span>
                  <span className={`text-xs ${dashboardMetrics.after.passRate < dashboardMetrics.before.passRate ? 'text-ordino-error' : 'text-ordino-success'}`}>
                    {dashboardMetrics.after.passRate < dashboardMetrics.before.passRate ? '↓' : '↑'}
                    {Math.abs(dashboardMetrics.after.passRate - dashboardMetrics.before.passRate).toFixed(1)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-ordino-text">{dashboardMetrics.after.passRate}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl border bg-ordino-bg border-ordino-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ordino-text-muted">Total Tests</span>
                  <span className="text-xs text-ordino-success">
                    +{dashboardMetrics.after.totalTests - dashboardMetrics.before.totalTests}
                  </span>
                </div>
                <p className="text-2xl font-bold text-ordino-text">{dashboardMetrics.after.totalTests}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl border bg-ordino-bg border-ordino-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ordino-text-muted">Coverage</span>
                  <span className="text-xs text-ordino-success">
                    +{(dashboardMetrics.after.coverage - dashboardMetrics.before.coverage).toFixed(1)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-ordino-text">{dashboardMetrics.after.coverage}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl border bg-ordino-bg border-ordino-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ordino-text-muted">Open Bugs</span>
                  <span className="text-xs text-ordino-error">
                    +{dashboardMetrics.after.openBugs - dashboardMetrics.before.openBugs}
                  </span>
                </div>
                <p className="text-2xl font-bold text-ordino-text">{dashboardMetrics.after.openBugs}</p>
              </motion.div>
            </div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-lg mx-auto"
            >
              <CheckCircle size={24} className="text-ordino-success mx-auto mb-2" />
              <p className="text-sm font-medium text-ordino-success">All Dashboards Updated</p>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs text-ordino-primary hover:underline mt-2"
              >
                View Dashboard
                <ExternalLink size={12} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
