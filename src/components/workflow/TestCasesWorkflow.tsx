import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, RotateCcw, Pause, PlayCircle, Clock, Zap, DollarSign } from 'lucide-react';
import { Button, Card } from '../common';
import { TestCasesTimeline } from './TestCasesTimeline';
import { useTestCasesWorkflow } from '../../hooks/useTestCasesWorkflow';
import { TestArtifactLookup, TestDesignReview, TestArtifactCreation, NotificationToast } from './steps';
import { GenerateTestCases, MaintainTraceability } from './steps/testcases';

const stepDescriptions = [
  '',
  'Ordino reviews test design, requirements, and UI designs to understand test coverage needs.',
  'Ordino gathers and analyzes existing test cases that may need updates based on new requirements.',
  'Ordino generates new test cases with execution strategy labels: automate, manual, or smoke.',
  'Ordino establishes bidirectional traceability links between test cases, requirements, and designs in Jira.',
  'QA Lead reviews and approves the generated test cases before creation.',
  'Ordino creates test cases in the test management tool and notifies stakeholders.',
];

// Time metrics for Test Cases workflow (in minutes for manual, seconds for Ordino)
const testCasesTimeMetrics = [
  { manual: 0, ordino: 0 }, // Step 0 (not started)
  { manual: 30, ordino: 15 }, // Step 1: Review artifacts (30 min vs 15 sec)
  { manual: 45, ordino: 20 }, // Step 2: Gather existing (45 min vs 20 sec)
  { manual: 120, ordino: 45 }, // Step 3: Generate cases (2 hrs vs 45 sec)
  { manual: 30, ordino: 20 }, // Step 4: Traceability (30 min vs 20 sec)
  { manual: 20, ordino: 15 }, // Step 5: Approval (20 min vs 15 sec)
  { manual: 15, ordino: 10 }, // Step 6: Confirm (15 min vs 10 sec)
];

export function TestCasesWorkflowComponent() {
  const {
    currentStep,
    steps,
    isPlaying,
    isComplete,
    testCasesApproved,
    start,
    next,
    reset,
    toggleAutoPlay,
    approveTestCases,
  } = useTestCasesWorkflow();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <TestArtifactLookup />;
      case 2:
        return <TestArtifactLookup />;
      case 3:
        return <GenerateTestCases />;
      case 4:
        return <MaintainTraceability />;
      case 5:
        return <TestDesignReview onApprove={approveTestCases} />;
      case 6:
        return (
          <>
            <TestArtifactCreation />
            <NotificationToast />
          </>
        );
      default:
        return null;
    }
  };

  // Step 5 (Approval) blocks until testCasesApproved
  const isBlockingStep = currentStep === 5 && !testCasesApproved;

  // Calculate cumulative metrics
  const cumulativeManualMinutes = testCasesTimeMetrics
    .slice(0, currentStep + 1)
    .reduce((acc, curr) => acc + curr.manual, 0);

  const cumulativeOrdinoSeconds = testCasesTimeMetrics
    .slice(0, currentStep + 1)
    .reduce((acc, curr) => acc + curr.ordino, 0);

  const costSaved = (cumulativeManualMinutes / 60 * 150).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ordino-text">Test Case Generation</h2>
            <p className="text-sm text-ordino-text-muted">
              Experience Ordino's 6-step automated test case generation workflow
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentStep === 0 ? (
              <Button onClick={start}>
                <Play size={18} />
                Start Demo
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={reset}>
                  <RotateCcw size={18} />
                  Reset
                </Button>
                <Button
                  variant="secondary"
                  onClick={toggleAutoPlay}
                  disabled={isComplete || isBlockingStep}
                >
                  {isPlaying ? <Pause size={18} /> : <PlayCircle size={18} />}
                  {isPlaying ? 'Pause' : 'Auto-play'}
                </Button>
                <Button onClick={next} disabled={isComplete || isBlockingStep}>
                  <SkipForward size={18} />
                  Next Step
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Time/Cost Tracker */}
      {currentStep > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-ordino-bg/50 border-ordino-border/50">
            <div className="flex items-center gap-3 p-2">
              <div className="p-2 rounded-full bg-ordino-text-muted/10">
                <Clock className="w-5 h-5 text-ordino-text-muted" />
              </div>
              <div>
                <p className="text-xs text-ordino-text-muted uppercase">Manual Time Est.</p>
                <p className="text-xl font-mono text-ordino-text-muted">
                  {cumulativeManualMinutes >= 60
                    ? `${(cumulativeManualMinutes / 60).toFixed(1)} hrs`
                    : `${cumulativeManualMinutes} min`}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-ordino-primary/10 border-ordino-primary/30">
            <div className="flex items-center gap-3 p-2">
              <div className="p-2 rounded-full bg-ordino-primary/20">
                <Zap className="w-5 h-5 text-ordino-primary" />
              </div>
              <div>
                <p className="text-xs text-ordino-primary uppercase">Ordino Time</p>
                <p className="text-xl font-mono text-ordino-primary font-bold">
                  {cumulativeOrdinoSeconds >= 60
                    ? `${(cumulativeOrdinoSeconds / 60).toFixed(1)} min`
                    : `${cumulativeOrdinoSeconds} sec`}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-ordino-success/10 border-ordino-success/30">
            <div className="flex items-center gap-3 p-2">
              <div className="p-2 rounded-full bg-ordino-success/20">
                <DollarSign className="w-5 h-5 text-ordino-success" />
              </div>
              <div>
                <p className="text-xs text-ordino-success uppercase">Est. Cost Savings</p>
                <p className="text-xl font-mono text-ordino-success font-bold">${costSaved}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main content */}
      {currentStep > 0 && (
        <div className="flex gap-6">
          {/* Timeline sidebar */}
          <TestCasesTimeline steps={steps} currentStep={currentStep} />

          {/* Step visualization */}
          <div className="flex-1">
            <Card className="min-h-[500px]">
              {/* Step header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-ordino-primary uppercase tracking-wider">
                    Step {currentStep} of 6
                  </span>
                  {isComplete && (
                    <span className="text-xs font-medium text-ordino-success uppercase tracking-wider">
                      — Complete!
                    </span>
                  )}
                  {isBlockingStep && (
                    <span className="text-xs font-medium text-ordino-warning uppercase tracking-wider">
                      — Awaiting Human Input
                    </span>
                  )}
                </div>
                <p className="text-ordino-text-muted">
                  {stepDescriptions[currentStep]}
                </p>
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Completion message */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-gradient-to-br from-ordino-success/10 to-ordino-primary/5 rounded-xl border border-ordino-success/20 shadow-lg"
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ordino-success/20 text-ordino-success mb-4">
                      <Zap size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-ordino-text mb-2">
                      Test Cases Created!
                    </h3>
                    <p className="text-ordino-text-muted">
                      Test cases generated with execution strategy labels, linked to requirements,
                      approved by QA, and created in test management tool — automatically.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-ordino-bg/50 rounded-lg">
                      <p className="text-sm text-ordino-text-muted">Total Time Saved</p>
                      <p className="text-2xl font-bold text-ordino-success">
                        {((cumulativeManualMinutes - cumulativeOrdinoSeconds / 60) / 60).toFixed(1)} Hours
                      </p>
                    </div>
                    <div className="text-center p-3 bg-ordino-bg/50 rounded-lg">
                      <p className="text-sm text-ordino-text-muted">Speed Improvement</p>
                      <p className="text-2xl font-bold text-ordino-primary">
                        {cumulativeOrdinoSeconds > 0
                          ? `~${Math.round(cumulativeManualMinutes * 60 / cumulativeOrdinoSeconds)}x Faster`
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-ordino-bg/50 rounded-lg">
                      <p className="text-sm text-ordino-text-muted">Cost Efficiency</p>
                      <p className="text-2xl font-bold text-ordino-success">${costSaved} Saved</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={reset} size="lg">
                      <RotateCcw size={18} />
                      Run Demo Again
                    </Button>
                  </div>
                </motion.div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Initial state */}
      {currentStep === 0 && (
        <Card className="text-center py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ordino-primary/20 flex items-center justify-center">
              <Play size={32} className="text-ordino-primary ml-1" />
            </div>
            <h3 className="text-2xl font-bold text-ordino-text mb-2">
              Ready for AI-Powered Test Case Generation?
            </h3>
            <p className="text-ordino-text-muted max-w-md mx-auto mb-6">
              Watch Ordino review artifacts, analyze existing test cases, generate new ones with
              execution strategy labels, establish traceability, and get QA approval — all automatically.
            </p>
            <Button size="lg" onClick={start}>
              <Play size={20} />
              Start Interactive Demo
            </Button>
          </motion.div>
        </Card>
      )}
    </div>
  );
}
