import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Code, GitBranch, ExternalLink, Play, GitCommit } from 'lucide-react';
import { Badge } from '../../common';
import { automationScripts } from '../../../data/mockData';

const repositoryConfig = {
  name: 'test-automation-repo',
  url: 'https://github.com/company/test-automation-repo',
  branch: 'main',
};

const readyScripts = automationScripts.filter(s => s.status === 'drafted');

const creationTasks = readyScripts.map((script, index) => ({
  id: script.id,
  name: script.id,
  description: script.testCaseTitle,
  scriptType: script.scriptType,
  framework: script.framework,
  duration: 2000 + index * 500,
}));

const scriptFilePaths: Record<string, string> = {
  'SCRIPT-001': 'src/tests/selenium/TwoFactorCodeValidationTest.java',
  'SCRIPT-002': 'src/tests/api/TwoFactorTimeoutTest.java',
};

const testOutputMap: Record<string, string[]> = {
  'SCRIPT-001': [
    'Initializing ChromeDriver...',
    'Navigating to https://app.company.com/login',
    'Entering credentials for test user...',
    'Waiting for 2FA prompt...',
    'Entering valid 2FA code...',
    'Asserting redirect to dashboard... PASSED',
    'Verifying session token is set... PASSED',
  ],
  'SCRIPT-002': [
    'Initializing REST client...',
    'POST /api/auth/login with valid credentials',
    'Received 200 OK with 2FA challenge',
    'Waiting for code expiry simulation...',
    'POST /api/auth/verify-2fa with expired code',
    'Asserting 401 Unauthorized response... PASSED',
    'Asserting error message matches expected... PASSED',
  ],
};

const gitOperations = [
  {
    id: 'git-add',
    label: 'Staging files',
    command: 'git add src/tests/selenium/TwoFactorCodeValidationTest.java src/tests/api/TwoFactorTimeoutTest.java',
    output: '2 files staged',
    duration: 800,
  },
  {
    id: 'git-commit',
    label: 'Committing changes',
    command: 'git commit -m "Add verified automation scripts for ORD-1234 2FA"',
    output: '[main a3f7c2d] Add verified automation scripts for ORD-1234 2FA\n 2 files changed, 247 insertions(+)',
    duration: 1200,
  },
  {
    id: 'git-push',
    label: 'Pushing to remote',
    command: 'git push origin main',
    output: 'To https://github.com/company/test-automation-repo.git\n   e4b2f1a..a3f7c2d  main -> main',
    duration: 1500,
  },
];

const phaseLabels = ['Create Scripts', 'Run Tests', 'Commit to Repo'];

export function AutomationScriptCreation() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [completedSubTasks, setCompletedSubTasks] = useState<string[]>([]);
  const [testOutputLines, setTestOutputLines] = useState<Record<string, string[]>>({});
  const [activeTestScript, setActiveTestScript] = useState<string | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const allComplete = completedPhases.length === 3;

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Phase 0: Create scripts locally
  useEffect(() => {
    if (currentPhase !== 0 || completedPhases.includes(0)) return;

    let cumulativeDelay = 0;
    creationTasks.forEach((task) => {
      const delay = cumulativeDelay + task.duration;
      const timer = setTimeout(() => {
        setCompletedSubTasks(prev => [...prev, `create-${task.id}`]);
      }, delay);
      timersRef.current.push(timer);
      cumulativeDelay = delay + 500;
    });

    // Advance phase after all scripts created
    const advanceTimer = setTimeout(() => {
      setCompletedPhases(prev => [...prev, 0]);
      const nextTimer = setTimeout(() => setCurrentPhase(1), 1000);
      timersRef.current.push(nextTimer);
    }, cumulativeDelay + 200);
    timersRef.current.push(advanceTimer);
  }, [currentPhase, completedPhases]);

  // Phase 1: Run tests locally
  useEffect(() => {
    if (currentPhase !== 1 || completedPhases.includes(1)) return;

    let cumulativeDelay = 0;

    readyScripts.forEach((script) => {
      const scriptId = script.id;
      const lines = testOutputMap[scriptId] || [];
      const scriptStart = cumulativeDelay;

      // Set active test script
      const activeTimer = setTimeout(() => {
        setActiveTestScript(scriptId);
      }, scriptStart);
      timersRef.current.push(activeTimer);

      // Show output lines one at a time
      lines.forEach((line, lineIndex) => {
        const lineDelay = scriptStart + (lineIndex + 1) * 400;
        const lineTimer = setTimeout(() => {
          setTestOutputLines(prev => ({
            ...prev,
            [scriptId]: [...(prev[scriptId] || []), line],
          }));
        }, lineDelay);
        timersRef.current.push(lineTimer);
      });

      // Mark test as passed
      const completeDelay = scriptStart + (lines.length + 1) * 400;
      const completeTimer = setTimeout(() => {
        setCompletedSubTasks(prev => [...prev, `test-${scriptId}`]);
        setActiveTestScript(null);
      }, completeDelay);
      timersRef.current.push(completeTimer);

      cumulativeDelay = completeDelay + 500;
    });

    // Advance phase after all tests pass
    const advanceTimer = setTimeout(() => {
      setCompletedPhases(prev => [...prev, 1]);
      const nextTimer = setTimeout(() => setCurrentPhase(2), 1200);
      timersRef.current.push(nextTimer);
    }, cumulativeDelay + 200);
    timersRef.current.push(advanceTimer);
  }, [currentPhase, completedPhases]);

  // Phase 2: Commit to repository
  useEffect(() => {
    if (currentPhase !== 2 || completedPhases.includes(2)) return;

    let cumulativeDelay = 0;

    gitOperations.forEach((op) => {
      const delay = cumulativeDelay + op.duration;
      const timer = setTimeout(() => {
        setCompletedSubTasks(prev => [...prev, op.id]);
      }, delay);
      timersRef.current.push(timer);
      cumulativeDelay = delay + 300;
    });

    // Mark phase complete
    const advanceTimer = setTimeout(() => {
      setCompletedPhases(prev => [...prev, 2]);
    }, cumulativeDelay + 200);
    timersRef.current.push(advanceTimer);
  }, [currentPhase, completedPhases]);

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
        {/* Phase 0: Create Scripts Locally */}
        {currentPhase === 0 && !completedPhases.includes(0) && (
          <motion.div
            key="phase-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
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
                  <Code size={32} className="text-ordino-secondary" />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Creating Automation Scripts Locally</h3>
              <p className="text-sm text-ordino-text-muted">Generating script files on local filesystem</p>
            </div>

            {/* Script creation tasks */}
            <div className="max-w-md mx-auto space-y-3">
              {creationTasks.map((task) => {
                const isComplete = completedSubTasks.includes(`create-${task.id}`);
                const filePath = scriptFilePaths[task.id] || '';

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-ordino-bg rounded-xl border p-4 ${
                      isComplete ? 'border-ordino-success/30' : 'border-ordino-border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isComplete ? 'bg-ordino-success/20' : 'bg-ordino-card'
                      }`}>
                        {isComplete ? (
                          <CheckCircle size={24} className="text-ordino-success" />
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader2 size={24} className="text-ordino-secondary" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-ordino-text">{task.name}</span>
                          <Badge variant="success" size="sm">{task.scriptType}</Badge>
                          <Badge variant="info" size="sm">{task.framework}</Badge>
                        </div>
                        <p className="text-sm text-ordino-text-muted mb-1">{task.description}</p>
                        <p className="text-xs font-mono text-ordino-text-muted">{filePath}</p>
                        <div className="h-1.5 bg-ordino-border rounded-full overflow-hidden mt-2">
                          <motion.div
                            className={`h-full ${isComplete ? 'bg-ordino-success' : 'bg-ordino-secondary'}`}
                            initial={{ width: '0%' }}
                            animate={{ width: isComplete ? '100%' : '60%' }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Phase 0 Summary (shown briefly before phase 1 starts) */}
        {completedPhases.includes(0) && currentPhase === 0 && (
          <motion.div
            key="phase-0-summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-md mx-auto"
          >
            <CheckCircle size={24} className="text-ordino-success mx-auto mb-2" />
            <p className="text-sm font-medium text-ordino-success">{creationTasks.length} scripts created locally</p>
          </motion.div>
        )}

        {/* Phase 1: Run Tests Locally */}
        {currentPhase === 1 && !completedPhases.includes(1) && (
          <motion.div
            key="phase-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
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
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Play size={32} className="text-ordino-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-semibold text-ordino-text">Running Automated Tests</h3>
              <p className="text-sm text-ordino-text-muted">Executing scripts locally to verify correctness</p>
            </div>

            {/* Test execution cards */}
            <div className="max-w-md mx-auto space-y-4">
              {readyScripts.map((script) => {
                const scriptId = script.id;
                const isComplete = completedSubTasks.includes(`test-${scriptId}`);
                const isRunning = activeTestScript === scriptId;
                const outputLines = testOutputLines[scriptId] || [];
                const hasStarted = outputLines.length > 0 || isComplete;

                if (!hasStarted && !isRunning) {
                  return (
                    <motion.div
                      key={scriptId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-ordino-card flex items-center justify-center">
                          <Loader2 size={20} className="text-ordino-text-muted" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-ordino-text-muted">{scriptId}</span>
                            <Badge variant="info" size="sm">{script.framework}</Badge>
                          </div>
                          <p className="text-xs text-ordino-text-muted mt-0.5">Waiting...</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={scriptId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-ordino-bg rounded-xl border p-4 ${
                      isComplete ? 'border-ordino-success/30' : 'border-ordino-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ordino-text">{scriptId}</span>
                        <Badge variant="info" size="sm">{script.framework}</Badge>
                      </div>
                      {isComplete ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                          <Badge variant="success" size="sm">PASSED</Badge>
                        </motion.div>
                      ) : (
                        <Badge variant="warning" size="sm">Running...</Badge>
                      )}
                    </div>

                    {/* Terminal output */}
                    <div className="bg-gray-900 rounded-lg p-3 max-h-48 overflow-y-auto">
                      <div className="space-y-1">
                        {outputLines.map((line, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`text-xs font-mono ${
                              line.includes('PASSED')
                                ? 'text-green-400'
                                : 'text-gray-300'
                            }`}
                          >
                            <span className="text-gray-500 mr-2">$</span>
                            {line}
                          </motion.div>
                        ))}
                        {isRunning && !isComplete && (
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
                  </motion.div>
                );
              })}
            </div>

            {/* Test results summary */}
            {readyScripts.every(s => completedSubTasks.includes(`test-${s.id}`)) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-md mx-auto"
              >
                <CheckCircle size={24} className="text-ordino-success mx-auto mb-2" />
                <p className="text-sm font-medium text-ordino-success">
                  Test Results: {readyScripts.length}/{readyScripts.length} Passed
                </p>
                <p className="text-xs text-ordino-text-muted mt-1">All tests verified successfully</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Phase 2: Commit to Repository */}
        {currentPhase === 2 && (
          <motion.div
            key="phase-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Header */}
            {!allComplete && (
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
                    <GitCommit size={32} className="text-ordino-secondary" />
                  </motion.div>
                </motion.div>
                <h3 className="text-lg font-semibold text-ordino-text">Committing to Repository</h3>
                <p className="text-sm text-ordino-text-muted">
                  Pushing verified scripts to {repositoryConfig.name}
                </p>
              </div>
            )}

            {/* Repository Info */}
            <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <GitBranch size={20} className="text-ordino-primary" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-ordino-text">Repository:</span>
                    <span className="text-sm text-ordino-text-muted">{repositoryConfig.name}</span>
                    <Badge variant="info" size="sm">{repositoryConfig.branch}</Badge>
                  </div>
                  <a
                    href={repositoryConfig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-ordino-primary hover:underline flex items-center gap-1"
                  >
                    {repositoryConfig.url}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Git operations */}
            <div className="max-w-md mx-auto space-y-3">
              {gitOperations.map((op) => {
                const isComplete = completedSubTasks.includes(op.id);

                return (
                  <motion.div
                    key={op.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-ordino-bg rounded-xl border p-4 ${
                      isComplete ? 'border-ordino-success/30' : 'border-ordino-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isComplete ? 'bg-ordino-success/20' : 'bg-ordino-card'
                      }`}>
                        {isComplete ? (
                          <CheckCircle size={16} className="text-ordino-success" />
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader2 size={16} className="text-ordino-secondary" />
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        isComplete ? 'text-ordino-success' : 'text-ordino-text'
                      }`}>
                        {op.label}
                      </span>
                    </div>

                    {/* Command */}
                    <div className="bg-gray-900 rounded-lg p-2 ml-11">
                      <p className="text-xs font-mono text-gray-300">
                        <span className="text-gray-500">$ </span>{op.command}
                      </p>
                      {isComplete && op.output && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1"
                        >
                          {op.output.split('\n').map((line, idx) => (
                            <p key={idx} className="text-xs font-mono text-green-400">{line}</p>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Final Summary */}
            {allComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-md mx-auto"
              >
                <CheckCircle size={32} className="text-ordino-success mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-ordino-success mb-2">Scripts Committed!</h4>
                <div className="text-sm text-ordino-text-muted space-y-1 mb-4">
                  <div>{creationTasks.length} automation script{creationTasks.length !== 1 ? 's' : ''} verified and committed</div>
                  <div className="mt-3 pt-3 border-t border-ordino-success/20 space-y-1">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-ordino-text-muted">Commit:</span>
                      <span className="font-mono text-ordino-text">a3f7c2d</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-ordino-text-muted">Files changed:</span>
                      <span className="text-ordino-text">2</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-ordino-text-muted">Insertions:</span>
                      <span className="text-ordino-text">+247</span>
                    </div>
                  </div>
                </div>
                <a
                  href={repositoryConfig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-ordino-primary hover:underline"
                >
                  View in Repository
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
