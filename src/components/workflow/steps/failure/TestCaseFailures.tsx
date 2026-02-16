import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Clock, Package } from 'lucide-react';
import { Badge } from '../../../common';
import { failedTestCases } from '../../../../data/testFailureMockData';

export function TestCaseFailures() {
  const [displayedFailures, setDisplayedFailures] = useState<string[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;

    const showNext = () => {
      if (!failedTestCases || index >= failedTestCases.length) {
        return;
      }
      
      const currentIndex = index;
      index++;
      const timer = setTimeout(() => {
        if (failedTestCases && currentIndex < failedTestCases.length && failedTestCases[currentIndex]?.id) {
          setDisplayedFailures(prev => [...prev, failedTestCases[currentIndex].id]);
          showNext();
        }
      }, 800);
      timers.push(timer);
    };

    const startTimer = setTimeout(showNext, 500);
    timers.push(startTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
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
          <AlertTriangle size={32} className="text-ordino-error" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          Test Cases Failing in Latest Release
        </h3>
        <p className="text-sm text-ordino-text-muted">
          Ordino detected {failedTestCases.length} test failures in release v2.4.1
        </p>
      </div>

      {/* Failed Test Cases */}
      <div className="max-w-2xl mx-auto space-y-3">
        <AnimatePresence>
          {failedTestCases.map((testCase, index) => {
            const isDisplayed = displayedFailures.includes(testCase.id);

            return (
              <motion.div
                key={testCase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isDisplayed ? 1 : 0, x: isDisplayed ? 0 : -20 }}
                transition={{ delay: index * 0.2 }}
                className={`bg-ordino-bg rounded-xl border p-4 ${
                  isDisplayed ? 'border-ordino-error/30' : 'border-ordino-border opacity-0'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ordino-error/20 flex items-center justify-center flex-shrink-0">
                    <XCircle size={20} className="text-ordino-error" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono font-medium text-ordino-text">
                        {testCase.id}
                      </span>
                      <Badge variant="error" size="sm">Failed</Badge>
                    </div>
                    <p className="text-sm font-medium text-ordino-text mb-1">
                      {testCase.name}
                    </p>
                    <p className="text-xs text-ordino-text-muted mb-2">
                      {testCase.description}
                    </p>
                    <div className="bg-ordino-card rounded-lg p-2 mt-2">
                      <p className="text-xs font-mono text-ordino-error">
                        {testCase.errorMessage}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-ordino-text-muted">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>
                          {testCase.failureTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={12} />
                        <span>{testCase.releaseVersion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary */}
      {displayedFailures.length === failedTestCases.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-6 p-4 bg-ordino-error/10 border border-ordino-error/20 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-ordino-error" />
            <span className="text-sm font-semibold text-ordino-text">
              Ordino has captured {failedTestCases.length} test failures
            </span>
          </div>
          <p className="text-xs text-ordino-text-muted">
            Starting investigation to identify root cause...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
