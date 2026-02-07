import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, RotateCcw, Pause, PlayCircle } from 'lucide-react';
import { Button, Card } from '../common';
import { WorkflowTimeline } from './WorkflowTimeline';
import { useWorkflowDemo } from '../../hooks/useWorkflowDemo';
import {
  JiraRequirement,
  OrdinoThinking,
  GapAnalysis,
  TestPlanPreview,
  ApprovalDialog,
  SyncProgress,
  NotificationToast,
} from './steps';

const stepDescriptions = [
  '',
  'A new requirement has been detected in Jira. Ordino is ready to analyze it.',
  'Ordino AI is analyzing the requirement to understand testability and identify coverage gaps.',
  'Analysis complete! Ordino has identified gaps in the current test coverage.',
  'Based on the analysis, Ordino is generating a comprehensive test plan.',
  'The test plan is ready for your review. Approve to apply changes.',
  'Approved! Ordino is now syncing the test cases to your connected tools.',
  'Almost done! Ordino is notifying all relevant stakeholders about the updates.',
];

export function WorkflowDemoComponent() {
  const {
    currentStep,
    steps,
    isPlaying,
    isComplete,
    start,
    next,
    reset,
    toggleAutoPlay,
  } = useWorkflowDemo();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <JiraRequirement />;
      case 2:
        return <OrdinoThinking />;
      case 3:
        return <GapAnalysis />;
      case 4:
        return <TestPlanPreview />;
      case 5:
        return <ApprovalDialog onApprove={next} onReject={reset} />;
      case 6:
        return <SyncProgress />;
      case 7:
        return <NotificationToast />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ordino-text">Interactive Demo</h2>
            <p className="text-sm text-ordino-text-muted">
              Experience Ordino's autonomous QA workflow
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
                  disabled={isComplete}
                >
                  {isPlaying ? <Pause size={18} /> : <PlayCircle size={18} />}
                  {isPlaying ? 'Pause' : 'Auto-play'}
                </Button>
                <Button onClick={next} disabled={isComplete || currentStep === 5}>
                  <SkipForward size={18} />
                  Next Step
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Main content */}
      {currentStep > 0 && (
        <div className="flex gap-6">
          {/* Timeline */}
          <WorkflowTimeline steps={steps} currentStep={currentStep} />

          {/* Step visualization */}
          <div className="flex-1">
            <Card className="min-h-[500px]">
              {/* Step header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-ordino-primary uppercase tracking-wider">
                    Step {currentStep} of 7
                  </span>
                  {isComplete && (
                    <span className="text-xs font-medium text-ordino-success uppercase tracking-wider">
                      - Complete!
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center p-6 bg-ordino-success/10 rounded-xl border border-ordino-success/20"
                >
                  <h3 className="text-xl font-bold text-ordino-success mb-2">
                    Workflow Complete!
                  </h3>
                  <p className="text-ordino-text-muted mb-4">
                    Ordino has successfully processed the requirement, generated tests,
                    and notified all stakeholders.
                  </p>
                  <Button onClick={reset}>
                    <RotateCcw size={18} />
                    Run Demo Again
                  </Button>
                </motion.div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Initial state */}
      {currentStep === 0 && (
        <Card className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ordino-primary/20 flex items-center justify-center">
              <Play size={32} className="text-ordino-primary ml-1" />
            </div>
            <h3 className="text-2xl font-bold text-ordino-text mb-2">
              Ready to Experience Ordino AI?
            </h3>
            <p className="text-ordino-text-muted max-w-md mx-auto mb-6">
              Watch how Ordino autonomously detects requirements, analyzes coverage gaps,
              generates test plans, and keeps your team in sync.
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
