import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Bug, AlertTriangle, ExternalLink } from 'lucide-react';
import { Badge } from '../../../common';
import { discoveredBugs, testResults, testSuite } from '../../../../data/testExecutionMockData';

const phaseLabels = ['Analyzing', 'Creating Tickets', 'Reported'];

export function ReportBugs() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [analyzedTests, setAnalyzedTests] = useState<string[]>([]);
  const [createdBugs, setCreatedBugs] = useState<string[]>([]);
  const mountedRef = useRef(true);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const failedTests = testSuite.filter(t => testResults[t.id]?.status === 'failed');

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

  // Phase 0: Analyzing failures
  useEffect(() => {
    if (currentPhase !== 0 || completedPhases.includes(0)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;
    const analyzeNext = () => {
      if (!mountedRef.current) return;
      if (index < failedTests.length) {
        const test = failedTests[index];
        if (!test) return;
        const timer = setTimeout(() => {
          if (!mountedRef.current) return;
          setAnalyzedTests(prev => [...prev, test.id]);
          index++;
          analyzeNext();
        }, 600);
        phaseTimers.push(timer);
      } else {
        setCompletedPhases(prev => [...prev, 0]);
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          transitionTimerRef.current = null;
          setCurrentPhase(1);
        }, 500);
      }
    };

    const startTimer = setTimeout(analyzeNext, 500);
    phaseTimers.push(startTimer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases, failedTests.length]);

  // Phase 1: Creating tickets
  useEffect(() => {
    if (currentPhase !== 1 || completedPhases.includes(1)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;
    const createNext = () => {
      if (!mountedRef.current) return;
      if (index < discoveredBugs.length) {
        const bug = discoveredBugs[index];
        if (!bug) return;
        const timer = setTimeout(() => {
          if (!mountedRef.current) return;
          setCreatedBugs(prev => [...prev, bug.id]);
          index++;
          createNext();
        }, 800);
        phaseTimers.push(timer);
      } else {
        setCompletedPhases(prev => [...prev, 1]);
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          transitionTimerRef.current = null;
          setCurrentPhase(2);
        }, 500);
      }
    };

    const startTimer = setTimeout(createNext, 500);
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
    }, 1000);
    phaseTimers.push(timer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge variant="error" size="sm">Critical</Badge>;
      case 'High':
        return <Badge variant="warning" size="sm">High</Badge>;
      case 'Medium':
        return <Badge variant="info" size="sm">Medium</Badge>;
      case 'Low':
        return <Badge variant="success" size="sm">Low</Badge>;
      default:
        return <Badge size="sm">{severity}</Badge>;
    }
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
        {/* Phase 0: Analyzing failures */}
        {currentPhase === 0 && !completedPhases.includes(0) && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-error/20 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 20px 10px rgba(239, 68, 68, 0)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Bug size={32} className="text-ordino-error" />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Analyzing Failed Tests</h3>
              <p className="text-sm text-ordino-text-muted">
                Scanning {failedTests.length} failed tests for defects
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              {failedTests.map((test) => {
                const isAnalyzed = analyzedTests.includes(test.id);
                const result = testResults[test.id];

                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-ordino-bg rounded-xl border p-4 ${
                      isAnalyzed ? 'border-ordino-error/30' : 'border-ordino-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isAnalyzed ? 'bg-ordino-error/20' : 'bg-ordino-card'
                      }`}>
                        {isAnalyzed ? (
                          <CheckCircle size={20} className="text-ordino-error" />
                        ) : (
                          <Loader2 size={20} className="text-ordino-text-muted animate-spin" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ordino-text">{test.name}</p>
                        <p className="text-xs text-ordino-text-muted">{test.id}</p>
                        {isAnalyzed && result?.errorMessage && (
                          <p className="text-xs text-ordino-error mt-1">{result.errorMessage}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Phase 1: Creating tickets */}
        {currentPhase === 1 && !completedPhases.includes(1) && (
          <motion.div
            key="creating"
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
                <Loader2 size={32} className="text-ordino-primary animate-spin" />
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Creating JIRA Tickets</h3>
              <p className="text-sm text-ordino-text-muted">
                Creating {discoveredBugs.length} bug tickets in JIRA
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              {discoveredBugs.map((bug) => {
                const isCreated = createdBugs.includes(bug.id);

                return (
                  <motion.div
                    key={bug.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-ordino-bg rounded-xl border p-4 ${
                      isCreated ? 'border-ordino-success/30' : 'border-ordino-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isCreated ? 'bg-ordino-success/20' : 'bg-ordino-card'
                      }`}>
                        {isCreated ? (
                          <CheckCircle size={20} className="text-ordino-success" />
                        ) : (
                          <Loader2 size={20} className="text-ordino-text-muted animate-spin" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono font-medium text-ordino-primary">
                            {bug.jiraKey}
                          </span>
                          {getSeverityBadge(bug.severity)}
                        </div>
                        <p className="text-sm text-ordino-text">{bug.title}</p>
                        <p className="text-xs text-ordino-text-muted mt-1">
                          Linked to: {bug.linkedTestId}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
              <h3 className="text-lg font-semibold text-ordino-text">Bugs Reported</h3>
              <p className="text-sm text-ordino-text-muted">
                {discoveredBugs.length} bug tickets created in JIRA
              </p>
            </div>

            {/* Bug Summary */}
            <div className="max-w-md mx-auto space-y-3">
              {discoveredBugs.map((bug, index) => (
                <motion.div
                  key={bug.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bug size={16} className="text-ordino-error" />
                      <a
                        href="#"
                        className="text-sm font-mono font-medium text-ordino-primary hover:underline flex items-center gap-1"
                      >
                        {bug.jiraKey}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    {getSeverityBadge(bug.severity)}
                  </div>
                  <p className="text-sm text-ordino-text mb-2">{bug.title}</p>
                  <div className="flex items-center justify-between text-xs text-ordino-text-muted">
                    <span>Linked: {bug.linkedTestId}</span>
                    <Badge variant="success" size="sm">Created</Badge>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Severity Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-4 max-w-md mx-auto"
            >
              {['Critical', 'High', 'Medium', 'Low'].map((severity) => {
                const count = discoveredBugs.filter(b => b.severity === severity).length;
                if (count === 0) return null;
                return (
                  <div
                    key={severity}
                    className="text-center p-3 bg-ordino-card rounded-lg"
                  >
                    <div className="flex items-center gap-1 justify-center mb-1">
                      <AlertTriangle size={14} className={
                        severity === 'Critical' ? 'text-ordino-error' :
                        severity === 'High' ? 'text-ordino-warning' :
                        'text-ordino-text-muted'
                      } />
                      <span className="text-lg font-bold text-ordino-text">{count}</span>
                    </div>
                    <p className="text-xs text-ordino-text-muted">{severity}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
