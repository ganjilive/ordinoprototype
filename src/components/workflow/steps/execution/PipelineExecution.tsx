import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Play, Box, TestTube, Shield, Upload } from 'lucide-react';
import { Badge } from '../../../common';
import { pipelineStages } from '../../../../data/testExecutionMockData';

const phaseLabels = ['Triggered', 'Running', 'Complete'];

const stageIcons: Record<string, React.ReactNode> = {
  'build': <Box size={20} />,
  'unit-tests': <TestTube size={20} />,
  'integration-tests': <TestTube size={20} />,
  'security-scan': <Shield size={20} />,
  'deploy-staging': <Upload size={20} />,
};

const stageDurations: Record<string, number> = {
  'build': 1200,
  'unit-tests': 1500,
  'integration-tests': 1800,
  'security-scan': 1000,
  'deploy-staging': 1400,
};

export function PipelineExecution() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [stageStates, setStageStates] = useState<Record<string, 'pending' | 'running' | 'success' | 'failed'>>(
    Object.fromEntries(pipelineStages.map(s => [s.id, 'pending']))
  );
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
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

  // Phase 0: Triggered
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

  // Phase 1: Running
  useEffect(() => {
    if (currentPhase !== 1 || completedPhases.includes(1)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;
    const runNextStage = () => {
      if (!mountedRef.current) return;
      if (index < pipelineStages.length) {
        const stage = pipelineStages[index];
        if (!stage) return;
        const stageId = stage.id;
        const duration = stageDurations[stageId] ?? 1000;
        setCurrentStageIndex(index);
        setStageStates(prev => ({ ...prev, [stageId]: 'running' }));

        const completeTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          setStageStates(prev => ({ ...prev, [stageId]: 'success' }));
          index++;
          runNextStage();
        }, duration);
        phaseTimers.push(completeTimer);
      } else {
        setCurrentStageIndex(-1);
        setCompletedPhases(prev => [...prev, 1]);
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          transitionTimerRef.current = null;
          setCurrentPhase(2);
        }, 500);
      }
    };

    const startTimer = setTimeout(runNextStage, 500);
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

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-ordino-success" />;
      case 'running':
        return <Loader2 size={16} className="text-ordino-primary animate-spin" />;
      case 'failed':
        return <span className="w-4 h-4 rounded-full bg-ordino-error" />;
      default:
        return <span className="w-4 h-4 rounded-full border-2 border-ordino-border" />;
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
        {/* Phase 0: Triggered */}
        {currentPhase === 0 && !completedPhases.includes(0) && (
          <motion.div
            key="triggered"
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
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Play size={32} className="text-ordino-primary ml-1" />
              </motion.div>
            </motion.div>
            <h3 className="text-lg font-semibold text-ordino-text">Pipeline Triggered</h3>
            <p className="text-sm text-ordino-text-muted">
              Initiating CI/CD pipeline with {pipelineStages.length} stages
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ordino-card rounded-full border border-ordino-border">
              <span className="w-2 h-2 rounded-full bg-ordino-primary animate-pulse" />
              <span className="text-xs text-ordino-text-muted">Queued for execution</span>
            </div>
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
                <Loader2 size={32} className="text-ordino-secondary animate-spin" />
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Pipeline Running</h3>
              <p className="text-sm text-ordino-text-muted">
                Stage {currentStageIndex + 1} of {pipelineStages.length}
              </p>
            </div>

            {/* Pipeline Stages */}
            <div className="max-w-lg mx-auto">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-ordino-border" />

                {/* Progress line */}
                <motion.div
                  className="absolute left-6 top-6 w-0.5 bg-ordino-success"
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(Object.values(stageStates).filter(s => s === 'success').length / pipelineStages.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />

                <div className="space-y-4">
                  {pipelineStages.map((stage, index) => {
                    const status = stageStates[stage.id];
                    const isRunning = status === 'running';

                    return (
                      <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border ${
                          isRunning
                            ? 'bg-ordino-primary/10 border-ordino-primary/30'
                            : status === 'success'
                            ? 'bg-ordino-success/5 border-ordino-success/20'
                            : 'bg-ordino-bg border-ordino-border'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          status === 'success'
                            ? 'bg-ordino-success/20 text-ordino-success'
                            : isRunning
                            ? 'bg-ordino-primary/20 text-ordino-primary'
                            : 'bg-ordino-card text-ordino-text-muted'
                        }`}>
                          {stageIcons[stage.id]}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            status === 'success'
                              ? 'text-ordino-success'
                              : isRunning
                              ? 'text-ordino-primary'
                              : 'text-ordino-text'
                          }`}>
                            {stage.name}
                          </p>
                          <p className="text-xs text-ordino-text-muted">
                            {isRunning ? 'Running...' : status === 'success' ? 'Completed' : 'Pending'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStageStatusIcon(status)}
                          {status === 'success' && (
                            <Badge variant="success" size="sm">Done</Badge>
                          )}
                          {isRunning && (
                            <Badge variant="info" size="sm">Running</Badge>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
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
              <h3 className="text-lg font-semibold text-ordino-text">Pipeline Complete</h3>
              <p className="text-sm text-ordino-text-muted">
                All {pipelineStages.length} stages completed successfully
              </p>
            </div>

            {/* Stage Summary */}
            <div className="max-w-lg mx-auto">
              <div className="grid grid-cols-5 gap-2">
                {pipelineStages.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-3 bg-ordino-success/10 rounded-lg border border-ordino-success/20"
                  >
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-ordino-success/20 flex items-center justify-center text-ordino-success">
                      <CheckCircle size={16} />
                    </div>
                    <p className="text-xs font-medium text-ordino-text truncate">{stage.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-lg mx-auto"
            >
              <CheckCircle size={24} className="text-ordino-success mx-auto mb-2" />
              <p className="text-sm font-medium text-ordino-success">Deployment Successful</p>
              <p className="text-xs text-ordino-text-muted mt-1">
                Changes deployed to staging environment
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
