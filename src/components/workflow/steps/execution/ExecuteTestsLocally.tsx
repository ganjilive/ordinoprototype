import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Play, SkipForward } from 'lucide-react';
import { Badge } from '../../../common';
import { testSuite, testResults } from '../../../../data/testExecutionMockData';

const phaseLabels = ['Starting', 'Running', 'Complete'];

export function ExecuteTestsLocally() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [executedTests, setExecutedTests] = useState<string[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getTestResult = (testId: string) => testResults[testId] || { status: 'pending', duration: 0 };

  const passedCount = executedTests.filter(id => getTestResult(id).status === 'passed').length;
  const failedCount = executedTests.filter(id => getTestResult(id).status === 'failed').length;
  const skippedCount = executedTests.filter(id => getTestResult(id).status === 'skipped').length;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const timers = timersRef.current;
      timers.forEach(clearTimeout);
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, []);

  // Phase 0: Starting
  useEffect(() => {
    if (currentPhase !== 0 || completedPhases.includes(0)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setCompletedPhases(prev => [...prev, 0]);
      setCurrentPhase(1);
    }, 1500);
    phaseTimers.push(timer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  // Phase 1: Running tests
  useEffect(() => {
    if (currentPhase !== 1 || completedPhases.includes(1)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;
    const runNextTest = () => {
      if (!mountedRef.current) return;
      if (index < testSuite.length) {
        const test = testSuite[index];
        if (!test) return;
        setCurrentTestIndex(index);
        const timer = setTimeout(() => {
          if (!mountedRef.current) return;
          setExecutedTests(prev => [...prev, test.id]);
          index++;
          runNextTest();
        }, 300);
        phaseTimers.push(timer);
      } else {
        setCurrentTestIndex(-1);
        setCompletedPhases(prev => [...prev, 1]);
        // Store in ref - must NOT be cleared by effect cleanup when completedPhases changes
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          transitionTimerRef.current = null;
          setCurrentPhase(2);
        }, 800);
      }
    };

    const startTimer = setTimeout(runNextTest, 500);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle size={16} className="text-ordino-success" />;
      case 'failed':
        return <XCircle size={16} className="text-ordino-error" />;
      case 'skipped':
        return <SkipForward size={16} className="text-ordino-warning" />;
      default:
        return <Loader2 size={16} className="text-ordino-text-muted animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="success" size="sm">PASSED</Badge>;
      case 'failed':
        return <Badge variant="error" size="sm">FAILED</Badge>;
      case 'skipped':
        return <Badge variant="warning" size="sm">SKIPPED</Badge>;
      default:
        return <Badge variant="info" size="sm">RUNNING</Badge>;
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
        {/* Phase 0: Starting */}
        {currentPhase === 0 && !completedPhases.includes(0) && (
          <motion.div
            key="starting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center space-y-4"
          >
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Play size={32} className="text-ordino-primary ml-1" />
              </motion.div>
            </motion.div>
            <h3 className="text-lg font-semibold text-ordino-text">Initializing Test Runner</h3>
            <p className="text-sm text-ordino-text-muted">
              Starting test suite with {testSuite.length} test cases
            </p>
          </motion.div>
        )}

        {/* Phase 1: Running */}
        {currentPhase === 1 && !completedPhases.includes(1) && (
          <motion.div
            key="running"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Header */}
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
              <h3 className="text-lg font-semibold text-ordino-text">Running Tests</h3>
              <p className="text-sm text-ordino-text-muted">
                Executing {executedTests.length}/{testSuite.length} tests
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-lg mx-auto">
              <div className="h-2 bg-ordino-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-ordino-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(executedTests.length / testSuite.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Test Results List */}
            <div className="max-w-lg mx-auto bg-ordino-bg rounded-xl border border-ordino-border p-4 max-h-[300px] overflow-y-auto">
              <div className="space-y-2">
                {testSuite.map((test, index) => {
                  const isExecuted = executedTests.includes(test.id);
                  const isCurrent = currentTestIndex === index;
                  const result = isExecuted ? getTestResult(test.id) : null;

                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0.5 }}
                      animate={{
                        opacity: isExecuted || isCurrent ? 1 : 0.5,
                        scale: isCurrent ? 1.02 : 1,
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isCurrent
                          ? 'bg-ordino-primary/10 border border-ordino-primary/30'
                          : isExecuted
                          ? 'bg-ordino-card'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isExecuted ? (
                          getStatusIcon(result?.status || 'pending')
                        ) : isCurrent ? (
                          <Loader2 size={16} className="text-ordino-primary animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-ordino-border" />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${isExecuted ? 'text-ordino-text' : 'text-ordino-text-muted'}`}>
                            {test.name}
                          </p>
                          <p className="text-xs text-ordino-text-muted">{test.id}</p>
                        </div>
                      </div>
                      {isExecuted && result && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-ordino-text-muted">
                            {result.duration > 0 ? `${result.duration.toFixed(1)}s` : '-'}
                          </span>
                          {getStatusBadge(result.status)}
                        </div>
                      )}
                      {isCurrent && (
                        <Badge variant="info" size="sm">RUNNING</Badge>
                      )}
                    </motion.div>
                  );
                })}
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
            {/* Header */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-success/20 flex items-center justify-center"
              >
                <CheckCircle size={32} className="text-ordino-success" />
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Test Execution Complete</h3>
              <p className="text-sm text-ordino-text-muted">
                All {testSuite.length} tests have been executed
              </p>
            </div>

            {/* Summary Stats */}
            <div className="flex justify-center gap-4 max-w-lg mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex-1 text-center p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20"
              >
                <CheckCircle size={24} className="text-ordino-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-ordino-success">{passedCount}</p>
                <p className="text-xs text-ordino-text-muted">Passed</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 text-center p-4 bg-ordino-error/10 rounded-xl border border-ordino-error/20"
              >
                <XCircle size={24} className="text-ordino-error mx-auto mb-2" />
                <p className="text-2xl font-bold text-ordino-error">{failedCount}</p>
                <p className="text-xs text-ordino-text-muted">Failed</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 text-center p-4 bg-ordino-warning/10 rounded-xl border border-ordino-warning/20"
              >
                <SkipForward size={24} className="text-ordino-warning mx-auto mb-2" />
                <p className="text-2xl font-bold text-ordino-warning">{skippedCount}</p>
                <p className="text-xs text-ordino-text-muted">Skipped</p>
              </motion.div>
            </div>

            {/* Pass Rate */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 bg-ordino-bg rounded-xl border border-ordino-border max-w-lg mx-auto"
            >
              <p className="text-sm text-ordino-text-muted mb-1">Pass Rate</p>
              <p className="text-3xl font-bold text-ordino-text">
                {((passedCount / testSuite.length) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-ordino-text-muted mt-1">
                Total Duration: {Object.values(testResults).reduce((acc, r) => acc + r.duration, 0).toFixed(1)}s
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
