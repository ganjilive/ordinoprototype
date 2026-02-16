import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Loader2, AlertCircle, Code, Database, Server } from 'lucide-react';
import { failedTestCases, bugDetails } from '../../../../data/testFailureMockData';

const investigationSteps = [
  { id: 1, label: 'Analyzing Error Patterns', icon: Code },
  { id: 2, label: 'Checking Recent Deployments', icon: Server },
  { id: 3, label: 'Reviewing Code Changes', icon: Database },
  { id: 4, label: 'Identifying Root Cause', icon: AlertCircle },
];

export function OrdinoInvestigation({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analysisResults, setAnalysisResults] = useState<string[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    investigationSteps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index + 1);
        setCompletedSteps(prev => [...prev, step.id]);
        
        // Add analysis results
        if (step.id === 1) {
          setAnalysisResults(prev => [...prev, 'All failures show 500 errors from 2FA endpoint']);
        } else if (step.id === 2) {
          setAnalysisResults(prev => [...prev, 'Deployment v2.4.1 introduced changes to AuthenticationService']);
        } else if (step.id === 3) {
          setAnalysisResults(prev => [...prev, 'Code format parsing logic was modified']);
        } else if (step.id === 4) {
          setAnalysisResults(prev => [...prev, 'Root cause: Null pointer exception in code validation']);
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      }, (index + 1) * 2000);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Search size={32} className="text-ordino-primary" />
          </motion.div>
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          Ordino Investigating Test Failures
        </h3>
        <p className="text-sm text-ordino-text-muted">
          Analyzing {failedTestCases.length} failed test cases to identify root cause
        </p>
      </div>

      {/* Investigation Steps */}
      <div className="max-w-2xl mx-auto space-y-4">
        {investigationSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === index + 1 && !isCompleted;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`bg-ordino-bg rounded-xl border p-4 ${
                isCompleted
                  ? 'border-ordino-success/30 bg-ordino-success/5'
                  : isActive
                    ? 'border-ordino-primary/30 bg-ordino-primary/5'
                    : 'border-ordino-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-ordino-success/20'
                      : isActive
                        ? 'bg-ordino-primary/20'
                        : 'bg-ordino-card'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={20} className="text-ordino-success" />
                  ) : isActive ? (
                    <Loader2 size={20} className="text-ordino-primary animate-spin" />
                  ) : (
                    <Icon size={20} className="text-ordino-text-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ordino-text">{step.label}</p>
                  {isCompleted && analysisResults[index] && (
                    <p className="text-xs text-ordino-text-muted mt-1">
                      {analysisResults[index]}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Investigation Summary */}
      {completedSteps.length === investigationSteps.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-6 p-4 bg-ordino-primary/10 border border-ordino-primary/20 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-ordino-primary" />
            <span className="text-sm font-semibold text-ordino-text">
              Investigation Complete
            </span>
          </div>
          <p className="text-xs text-ordino-text-muted mb-2">
            Root cause identified: Bug in 2FA validation endpoint
          </p>
          <div className="space-y-1 text-xs text-ordino-text-muted">
            <p>• Affected component: {bugDetails.component}</p>
            <p>• Affected test cases: {bugDetails.affectedTestCases.join(', ')}</p>
            <p>• Severity: {bugDetails.severity}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
