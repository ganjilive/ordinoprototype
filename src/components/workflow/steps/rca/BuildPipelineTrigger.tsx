import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Play, Box, TestTube, Shield, Upload, XCircle } from 'lucide-react';

const phaseLabels = ['Queued', 'Running', 'Result'];

interface Stage {
  id: string;
  name: string;
  icon: React.ReactNode;
  duration: number;
  fails: boolean;
}

const stages: Stage[] = [
  { id: 'build', name: 'Build', icon: <Box size={20} />, duration: 1000, fails: false },
  { id: 'unit-tests', name: 'Unit Tests', icon: <TestTube size={20} />, duration: 1200, fails: false },
  { id: 'integration-tests', name: 'Integration Tests', icon: <TestTube size={20} />, duration: 1500, fails: true },
  { id: 'security-scan', name: 'Security Scan', icon: <Shield size={20} />, duration: 900, fails: false },
  { id: 'deploy-staging', name: 'Deploy to Staging', icon: <Upload size={20} />, duration: 1100, fails: false },
];

type StageStatus = 'pending' | 'running' | 'success' | 'failed';

export function BuildPipelineTrigger() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [stageStates, setStageStates] = useState<Record<string, StageStatus>>(
    Object.fromEntries(stages.map(s => [s.id, 'pending']))
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

  // Phase 0: Queued
  useEffect(() => {
    if (currentPhase !== 0 || completedPhases.includes(0)) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setCompletedPhases(prev => [...prev, 0]);
      setCurrentPhase(1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentPhase, completedPhases]);

  // Phase 1: Running stages
  useEffect(() => {
    if (currentPhase !== 1 || completedPhases.includes(1)) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let index = 0;

    const runNextStage = () => {
      if (!mountedRef.current) return;
      if (index < stages.length) {
        const stage = stages[index];
        if (!stage) return;
        setCurrentStageIndex(index);
        setStageStates(prev => ({ ...prev, [stage.id]: 'running' }));

        const completeTimer = setTimeout(() => {
          if (!mountedRef.current) return;
          const result: StageStatus = stage.fails ? 'failed' : 'success';
          setStageStates(prev => ({ ...prev, [stage.id]: result }));
          if (stage.fails) {
            // Stop pipeline on failure
            setCurrentStageIndex(-1);
            setCompletedPhases(prev => [...prev, 1]);
            transitionTimerRef.current = setTimeout(() => {
              if (!mountedRef.current) return;
              setCurrentPhase(2);
            }, 500);
          } else {
            index++;
            runNextStage();
          }
        }, stage.duration);
        timers.push(completeTimer);
      } else {
        setCurrentStageIndex(-1);
        setCompletedPhases(prev => [...prev, 1]);
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setCurrentPhase(2);
        }, 500);
      }
    };

    const startTimer = setTimeout(runNextStage, 500);
    timers.push(startTimer);
    return () => timers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  // Phase 2: Result
  useEffect(() => {
    if (currentPhase !== 2 || completedPhases.includes(2)) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setCompletedPhases(prev => [...prev, 2]);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentPhase, completedPhases]);

  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} className="text-ordino-success" />;
      case 'running': return <Loader2 size={16} className="text-ordino-primary animate-spin" />;
      case 'failed': return <XCircle size={16} className="text-ordino-error" />;
      default: return <span className="w-4 h-4 rounded-full border-2 border-ordino-border inline-block" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Phase Progress */}
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
                      ? 'bg-ordino-error/20 border-ordino-error text-ordino-error'
                      : isActive
                      ? 'bg-ordino-primary/20 border-ordino-primary text-ordino-primary'
                      : 'bg-ordino-card border-ordino-border text-ordino-text-muted'
                  }`}
                  animate={isActive ? { boxShadow: ['0 0 0 0 rgba(249, 115, 22, 0.3)', '0 0 12px 4px rgba(249, 115, 22, 0)'] } : {}}
                  transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  {isDone && index === 2 ? <XCircle size={16} /> : isDone ? <CheckCircle size={16} /> : index + 1}
                </motion.div>
                <span className={`text-[10px] font-medium whitespace-nowrap ${
                  isDone ? (index === 2 ? 'text-ordino-error' : 'text-ordino-success')
                    : isActive ? 'text-ordino-primary' : 'text-ordino-text-muted'
                }`}>{label}</span>
              </div>
              {index < phaseLabels.length - 1 && (
                <div className="h-0.5 w-6 bg-ordino-border rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-ordino-primary"
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
        {/* Phase 0: Queued */}
        {currentPhase === 0 && !completedPhases.includes(0) && (
          <motion.div key="queued" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center space-y-4">
            <motion.div
              className="w-16 h-16 mx-auto rounded-full bg-ordino-primary/20 flex items-center justify-center"
              animate={{ boxShadow: ['0 0 0 0 rgba(249, 115, 22, 0.4)', '0 0 20px 10px rgba(249, 115, 22, 0)'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <Play size={32} className="text-ordino-primary ml-1" />
              </motion.div>
            </motion.div>
            <h3 className="text-lg font-semibold text-ordino-text">Build #50 Queued</h3>
            <p className="text-sm text-ordino-text-muted">Initiating CI/CD pipeline — TC-042 included in test suite</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ordino-card rounded-full border border-ordino-border">
              <span className="w-2 h-2 rounded-full bg-ordino-primary animate-pulse" />
              <span className="text-xs text-ordino-text-muted">Waiting for runner...</span>
            </div>
          </motion.div>
        )}

        {/* Phase 1: Running */}
        {currentPhase === 1 && !completedPhases.includes(1) && (
          <motion.div key="running" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
                animate={{ boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.4)', '0 0 20px 10px rgba(59, 130, 246, 0)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Loader2 size={32} className="text-ordino-secondary animate-spin" />
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Pipeline Running</h3>
              <p className="text-sm text-ordino-text-muted">Build #50 — Stage {currentStageIndex + 1} of {stages.length}</p>
            </div>

            <div className="max-w-lg mx-auto space-y-3">
              {stages.map((stage, index) => {
                const status = stageStates[stage.id] ?? 'pending';
                const isRunning = status === 'running';
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-3 rounded-xl border ${
                      isRunning ? 'bg-ordino-primary/10 border-ordino-primary/30'
                        : status === 'success' ? 'bg-ordino-success/5 border-ordino-success/20'
                        : status === 'failed' ? 'bg-ordino-error/10 border-ordino-error/30'
                        : 'bg-ordino-bg border-ordino-border'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status === 'success' ? 'bg-ordino-success/20 text-ordino-success'
                        : status === 'failed' ? 'bg-ordino-error/20 text-ordino-error'
                        : isRunning ? 'bg-ordino-primary/20 text-ordino-primary'
                        : 'bg-ordino-card text-ordino-text-muted'
                    }`}>
                      {stage.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        status === 'success' ? 'text-ordino-success'
                          : status === 'failed' ? 'text-ordino-error'
                          : isRunning ? 'text-ordino-primary' : 'text-ordino-text'
                      }`}>{stage.name}</p>
                      <p className="text-xs text-ordino-text-muted">
                        {isRunning ? 'Running...' : status === 'success' ? 'Passed' : status === 'failed' ? 'FAILED' : 'Pending'}
                      </p>
                    </div>
                    {getStatusIcon(status)}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Phase 2: Result — failure */}
        {currentPhase === 2 && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <div className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-error/20 flex items-center justify-center">
                <XCircle size={32} className="text-ordino-error" />
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Build #50 Failed</h3>
              <p className="text-sm text-ordino-text-muted">Integration tests failed — 1 test case failing</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto p-4 bg-ordino-error/10 rounded-xl border border-ordino-error/30 font-mono text-xs text-ordino-text-muted space-y-1"
            >
              <p className="text-ordino-error font-semibold">FAILED: TC-042 UserAuthenticationTimeoutTest</p>
              <p>  AssertionError: Expected token expiry 3600s</p>
              <p>    but was: 300s</p>
              <p>  at AuthTimeoutTest.java:47</p>
              <p className="text-ordino-text-muted mt-2">Build time: 6.7s | Exit code: 1</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
