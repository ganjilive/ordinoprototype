import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, GitBranch, Folder, FileText, Terminal } from 'lucide-react';
import { repositoryConfig } from '../../../../data/testExecutionMockData';

const phaseLabels = ['Initializing', 'Downloading', 'Complete'];

const gitCloneOutput = [
  'Cloning into \'test-automation-scripts\'...',
  'remote: Enumerating objects: 156, done.',
  'remote: Counting objects: 100% (156/156), done.',
  'remote: Compressing objects: 100% (98/98), done.',
  'remote: Total 156 (delta 47), reused 142 (delta 38), pack-reused 0',
  'Receiving objects: 100% (156/156), 89.42 KiB | 2.98 MiB/s, done.',
  'Resolving deltas: 100% (47/47), done.',
];

export function CloneRepository() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(true);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allComplete = completedPhases.length === 3;

  // Cleanup on unmount
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

  // Phase 0: Initializing - Show git clone command
  useEffect(() => {
    if (currentPhase !== 0 || completedPhases.includes(0)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setOutputLines(['$ ' + repositoryConfig.cloneCommand]);
      const advanceTimer = setTimeout(() => {
        if (!mountedRef.current) return;
        setCompletedPhases(prev => [...prev, 0]);
        setCurrentPhase(1);
      }, 1000);
      phaseTimers.push(advanceTimer);
    }, 500);
    phaseTimers.push(timer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  // Phase 1: Downloading - Show progress and git output
  useEffect(() => {
    if (currentPhase !== 1 || completedPhases.includes(1)) return;

    const phaseTimers: ReturnType<typeof setTimeout>[] = [];
    let lineIndex = 0;
    const showLine = () => {
      if (!mountedRef.current) return;
      if (lineIndex < gitCloneOutput.length) {
        const line = gitCloneOutput[lineIndex];
        setOutputLines(prev => [...prev, line]);
        setDownloadProgress(((lineIndex + 1) / gitCloneOutput.length) * 100);
        lineIndex++;
        const timer = setTimeout(showLine, 400);
        phaseTimers.push(timer);
      } else {
        setCompletedPhases(prev => [...prev, 1]);
        // Store transition timer in ref - must NOT be cleared by effect cleanup (which runs when completedPhases changes)
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          transitionTimerRef.current = null;
          setCurrentPhase(2);
        }, 800);
      }
    };

    const startTimer = setTimeout(showLine, 300);
    phaseTimers.push(startTimer);
    return () => phaseTimers.forEach(clearTimeout);
  }, [currentPhase, completedPhases]);

  // Phase 2: Complete - Show file tree
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

  const renderFileTree = () => (
    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
      {repositoryConfig.fileTree.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2"
          style={{ paddingLeft: `${item.level * 16}px` }}
        >
          {item.type === 'folder' ? (
            <Folder size={14} className="text-ordino-primary" />
          ) : (
            <FileText size={14} className="text-ordino-text-muted" />
          )}
          <span className={item.type === 'folder' ? 'text-ordino-primary' : 'text-gray-300'}>
            {item.name}
          </span>
        </motion.div>
      ))}
    </div>
  );

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
        {/* Phase 0 & 1: Terminal Output */}
        {(currentPhase === 0 || currentPhase === 1) && !completedPhases.includes(1) && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Header */}
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
                  <GitBranch size={32} className="text-ordino-secondary" />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Cloning Test Repository</h3>
              <p className="text-sm text-ordino-text-muted">
                Downloading automation scripts from {repositoryConfig.name}
              </p>
            </div>

            {/* Terminal */}
            <div className="max-w-lg mx-auto">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <Terminal size={14} className="text-ordino-text-muted" />
                  <span className="text-xs text-ordino-text-muted">Terminal</span>
                </div>
                <div className="p-4 space-y-1 min-h-[200px] max-h-[250px] overflow-y-auto">
                  {outputLines.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-xs font-mono ${
                        line.startsWith('$') ? 'text-ordino-primary' : 'text-gray-300'
                      }`}
                    >
                      {line}
                    </motion.div>
                  ))}
                  {currentPhase === 1 && !completedPhases.includes(1) && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="text-xs font-mono text-ordino-primary"
                    >
                      _
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {currentPhase === 1 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-ordino-text-muted mb-1">
                    <span>Downloading...</span>
                    <span>{Math.round(downloadProgress)}%</span>
                  </div>
                  <div className="h-2 bg-ordino-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-ordino-secondary"
                      initial={{ width: '0%' }}
                      animate={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Phase 2: File Tree */}
        {currentPhase === 2 && (
          <motion.div
            key="file-tree"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="text-center">
              {!allComplete ? (
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
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-success/20 flex items-center justify-center"
                >
                  <CheckCircle size={32} className="text-ordino-success" />
                </motion.div>
              )}
              <h3 className="text-lg font-semibold text-ordino-text">
                {allComplete ? 'Repository Cloned!' : 'Listing Files...'}
              </h3>
              <p className="text-sm text-ordino-text-muted">
                {allComplete ? `${repositoryConfig.fileTree.length} files ready for execution` : 'Building file tree...'}
              </p>
            </div>

            <div className="max-w-lg mx-auto">
              {renderFileTree()}
            </div>

            {allComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-lg mx-auto"
              >
                <CheckCircle size={24} className="text-ordino-success mx-auto mb-2" />
                <p className="text-sm font-medium text-ordino-success">Repository cloned successfully</p>
                <p className="text-xs text-ordino-text-muted mt-1">
                  Branch: {repositoryConfig.branch} | {repositoryConfig.fileTree.filter(f => f.type === 'file').length} test files
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
