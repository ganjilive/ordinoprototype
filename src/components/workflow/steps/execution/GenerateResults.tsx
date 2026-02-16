import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, FileText, Code, BarChart3, PieChart, Download } from 'lucide-react';
import { Badge } from '../../../common';
import { reportTypes } from '../../../../data/testExecutionMockData';

const phaseLabels = ['Generating', 'Complete'];

const reportIcons: Record<string, React.ReactNode> = {
  'html': <FileText size={24} />,
  'junit': <Code size={24} />,
  'coverage': <BarChart3 size={24} />,
  'allure': <PieChart size={24} />,
};

export function GenerateResults() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [generatedReports, setGeneratedReports] = useState<string[]>([]);
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

  // Phase 0: Generating
  useEffect(() => {
    if (currentPhase !== 0 || completedPhases.includes(0)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;
    const generateNext = () => {
      if (!mountedRef.current) return;
      if (index < reportTypes.length) {
        const report = reportTypes[index];
        if (!report) return;
        const timer = setTimeout(() => {
          if (!mountedRef.current) return;
          setGeneratedReports(prev => [...prev, report.id]);
          index++;
          generateNext();
        }, 700);
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

    const startTimer = setTimeout(generateNext, 500);
    phaseTimers.push(startTimer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  // Phase 1: Complete
  useEffect(() => {
    if (currentPhase !== 1 || completedPhases.includes(1)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setCompletedPhases(prev => [...prev, 1]);
    }, 1000);
    phaseTimers.push(timer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Phase Progress Indicator */}
      <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
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
                <div className="h-0.5 w-8 bg-ordino-border rounded-full overflow-hidden mb-4">
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
        {/* Phase 0: Generating */}
        {currentPhase === 0 && !completedPhases.includes(0) && (
          <motion.div
            key="generating"
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
                  <FileText size={32} className="text-ordino-secondary" />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Generating Reports</h3>
              <p className="text-sm text-ordino-text-muted">
                Creating {reportTypes.length} report types
              </p>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {reportTypes.map((report) => {
                const isGenerated = generatedReports.includes(report.id);

                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl border ${
                      isGenerated
                        ? 'bg-ordino-success/5 border-ordino-success/30'
                        : 'bg-ordino-bg border-ordino-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isGenerated
                          ? 'bg-ordino-success/20 text-ordino-success'
                          : 'bg-ordino-card text-ordino-text-muted'
                      }`}>
                        {isGenerated ? (
                          <CheckCircle size={24} />
                        ) : (
                          <Loader2 size={24} className="animate-spin" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isGenerated ? 'text-ordino-success' : 'text-ordino-text'
                        }`}>
                          {report.name}
                        </p>
                        <p className="text-xs text-ordino-text-muted">{report.description}</p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 bg-ordino-border rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${isGenerated ? 'bg-ordino-success' : 'bg-ordino-secondary'}`}
                        initial={{ width: '0%' }}
                        animate={{ width: isGenerated ? '100%' : '60%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Phase 1: Complete */}
        {currentPhase === 1 && (
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
              <h3 className="text-lg font-semibold text-ordino-text">Reports Generated</h3>
              <p className="text-sm text-ordino-text-muted">
                All {reportTypes.length} reports are ready
              </p>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {reportTypes.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl border bg-ordino-bg border-ordino-border hover:border-ordino-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-ordino-primary/10 flex items-center justify-center text-ordino-primary">
                      {reportIcons[report.id]}
                    </div>
                    <Badge variant="success" size="sm">Ready</Badge>
                  </div>
                  <h4 className="text-sm font-medium text-ordino-text mb-1">{report.name}</h4>
                  <p className="text-xs text-ordino-text-muted mb-3">{report.description}</p>
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-ordino-primary bg-ordino-primary/10 rounded-lg hover:bg-ordino-primary/20 transition-colors">
                    <Download size={14} />
                    Download
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-lg mx-auto"
            >
              <CheckCircle size={24} className="text-ordino-success mx-auto mb-2" />
              <p className="text-sm font-medium text-ordino-success">All Reports Generated</p>
              <p className="text-xs text-ordino-text-muted mt-1">
                Reports saved to test-results/ directory
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
