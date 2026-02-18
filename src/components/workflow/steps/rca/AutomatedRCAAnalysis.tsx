import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Brain } from 'lucide-react';
import { rcaAnalysisSteps } from '../../../../data/rcaMockData';

const borderColors: Record<string, string> = {
  error: 'border-ordino-error',
  warning: 'border-ordino-warning',
  info: 'border-ordino-secondary',
};

const findingColors: Record<string, string> = {
  error: 'text-ordino-error',
  warning: 'text-ordino-warning',
  info: 'text-ordino-secondary',
};

export function AutomatedRCAAnalysis() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    rcaAnalysisSteps.forEach((step, index) => {
      const startDelay = index * 1500 + 500;
      const t1 = setTimeout(() => {
        if (!mountedRef.current) return;
        setCurrentStepIndex(index);
      }, startDelay);
      timers.push(t1);

      const t2 = setTimeout(() => {
        if (!mountedRef.current) return;
        setCompletedSteps(prev => [...prev, step.id]);
      }, startDelay + 1200);
      timers.push(t2);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ordino-primary/20 to-ordino-secondary/20 flex items-center justify-center"
          animate={{ boxShadow: ['0 0 0 0 rgba(249, 115, 22, 0.3)', '0 0 20px 8px rgba(249, 115, 22, 0)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
            <Brain size={32} className="text-ordino-primary" />
          </motion.div>
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">Automated RCA Analysis</h3>
        <p className="text-sm text-ordino-text-muted">
          Running {rcaAnalysisSteps.length} analysis modules in sequence
        </p>
      </div>

      {/* Analysis Steps */}
      <div className="max-w-lg mx-auto space-y-3">
        {rcaAnalysisSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStepIndex === index && !isCompleted;
          const isPending = index > currentStepIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-l-4 ${
                isCompleted
                  ? borderColors[step.type] ?? 'border-ordino-success'
                  : isActive
                  ? 'border-ordino-primary'
                  : 'border-ordino-border'
              } bg-ordino-bg border border-ordino-border border-l-4`}
              style={{
                borderLeftColor: isCompleted
                  ? undefined
                  : isActive
                  ? '#f97316'
                  : '#334155',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle size={18} className="text-ordino-success" />
                    </motion.div>
                  ) : isActive ? (
                    <Loader2 size={18} className="text-ordino-primary animate-spin" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-ordino-border inline-block" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isCompleted ? 'text-ordino-text'
                      : isActive ? 'text-ordino-primary'
                      : 'text-ordino-text-muted'
                  }`}>
                    {step.label}
                  </p>
                  {isCompleted && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`text-xs mt-1 font-medium ${findingColors[step.type] ?? 'text-ordino-success'}`}
                    >
                      → {step.finding}
                    </motion.p>
                  )}
                  {isActive && (
                    <p className="text-xs mt-1 text-ordino-text-muted">Analyzing...</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress summary */}
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between text-xs text-ordino-text-muted mb-1">
          <span>Analysis progress</span>
          <span>{completedSteps.length} / {rcaAnalysisSteps.length} modules</span>
        </div>
        <div className="h-2 bg-ordino-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ordino-primary to-ordino-secondary"
            initial={{ width: '0%' }}
            animate={{ width: `${(completedSteps.length / rcaAnalysisSteps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
