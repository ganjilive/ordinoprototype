import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, RotateCcw, Pause, PlayCircle } from 'lucide-react';
import { Button, Card } from '../common';
import { WorkflowTimeline } from './WorkflowTimeline';
import { useWorkflowDemo } from '../../hooks/useWorkflowDemo';
import {
  JiraRequirement,
  OrdinoThinking,
  TestPlanLookup,
  DraftedTestDesignReview,
  TestDesignCreation,
  AutomationScriptEvaluation,
  AutomationScriptDrafting,
  AutomationScriptApproval,
  AutomationScriptCreation,
  NotificationToast,
} from './steps';

const stepDescriptions = [
  '',
  'A new requirement has been detected in Jira. Ordino is ready to analyze it.',
  'Ordino AI is analyzing the requirement to understand testability and identify coverage gaps.',
  'Ordino is looking up the existing test plan, analyzing test designs, and drafting new test cases.',
  'Review the drafted test design and test cases. Approve to proceed with creation.',
  'Creating approved test design version and test cases.',
  'Evaluating automation requirements and notifying UX designer for design access.',
  'Drafting test automation scripts based on available information.',
  'Review the drafted automation scripts. Approve to create them in the repository.',
  'Creating approved automation scripts in the configured test script repository.',
  'Notifying stakeholders with a summary of what was accomplished.',
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
        return <TestPlanLookup />;
      case 4:
        return <DraftedTestDesignReview onApprove={next} onReject={reset} />;
      case 5:
        return <TestDesignCreation />;
      case 6:
        return <AutomationScriptEvaluation />;
      case 7:
        return <AutomationScriptDrafting />;
      case 8:
        return <AutomationScriptApproval onApprove={next} onReject={reset} />;
      case 9:
        return <AutomationScriptCreation />;
      case 10:
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
            <h2 className="text-lg font-semibold text-ordino-text">Create test automation scripts based on a new requirement</h2>
            <p className="text-sm text-ordino-text-muted">
              Experience Ordino's autonomous test automation workflow
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
                <Button onClick={next} disabled={isComplete || currentStep === 4 || currentStep === 8}>
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
                    Step {currentStep} of 10
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
                    Ordino has successfully created test automation scripts based on the requirement
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
              Ready to Create Test Automation Scripts?
            </h3>
            <p className="text-ordino-text-muted max-w-md mx-auto mb-6">
              Watch how Ordino autonomously analyzes requirements, creates test designs,
              drafts automation scripts, and creates them in your repository.
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
