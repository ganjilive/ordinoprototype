import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, RotateCcw, Pause, PlayCircle, AlertCircle } from 'lucide-react';
import { Button, Card } from '../common';
import { WorkflowTimeline } from './WorkflowTimeline';
import { useWorkflowDemo } from '../../hooks/useWorkflowDemo';
import {
  JiraRequirement,
  OrdinoThinking,
  TestPlanLookup,
  DraftedTestDesignReview,
  TestDesignCreation,
  AutomationScriptDrafting,
  AutomationScriptApproval,
  AutomationScriptCreation,
  NotificationToast,
  RequirementsTriage,
  TriageApproval,
  TestDesignDrafting,
  PeerReview,
  TestDataStrategy,
  TestDataApproval,
  BlockerDisplay,
} from './steps';
import { sampleBlockers } from '../../data/mockData';

const stepDescriptions = [
  '',
  'A new requirement has been detected in Jira. Ordino is ready to analyze it.',
  'Ordino AI is analyzing the requirement to understand testability and identify coverage gaps.',
  'Assessing requirement completeness, testability, and dependencies before proceeding.',
  'Multi-level approval process to validate triage results and authorize test design.',
  'Looking up existing test plan to understand current test coverage and design patterns.',
  'Drafting test design with early automation feasibility assessment for each test case.',
  'Peer review of the drafted test design for completeness and automation strategy.',
  'Lead review incorporating peer feedback and finalizing test design approach.',
  'Defining test data requirements, generation strategy, and privacy compliance.',
  'Reviewing and approving test data strategy to ensure data availability.',
  'Creating approved test design version and test cases.',
  'Drafting test automation scripts based on available information and approved design.',
  'Review the drafted automation scripts. Approve to create them in the repository.',
  'Creating approved automation scripts in the configured test script repository.',
  'Notifying stakeholders with a summary of what was accomplished.',
  'Workflow complete! All test designs and automation scripts have been created.',
];

export function WorkflowDemoComponent() {
  const {
    currentStep,
    steps,
    isPlaying,
    isComplete,
    isBlocked,
    activeBlockers,
    start,
    next,
    reset,
    toggleAutoPlay,
    triggerBlocker,
    resolveBlocker,
    escalate,
  } = useWorkflowDemo();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <JiraRequirement />;
      case 2:
        return <OrdinoThinking />;
      case 3:
        return <RequirementsTriage />;
      case 4:
        return <TriageApproval onApprove={next} onReject={reset} />;
      case 5:
        return <TestPlanLookup />;
      case 6:
        return <TestDesignDrafting />;
      case 7:
        return <PeerReview onApprove={next} onReject={reset} />;
      case 8:
        return <DraftedTestDesignReview onApprove={next} onReject={reset} />;
      case 9:
        return <TestDataStrategy />;
      case 10:
        return <TestDataApproval onApprove={next} onReject={reset} />;
      case 11:
        return <TestDesignCreation />;
      case 12:
        return <AutomationScriptDrafting />;
      case 13:
        return <AutomationScriptApproval onApprove={next} onReject={reset} />;
      case 14:
        return <AutomationScriptCreation />;
      case 15:
        return <NotificationToast />;
      case 16:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ordino-success/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-ordino-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-ordino-success mb-2">
              Workflow Complete!
            </h3>
            <p className="text-ordino-text-muted max-w-md mx-auto">
              All test designs and automation scripts have been created successfully.
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Determine which steps should disable the Next button (approval steps or blocked)
  const isApprovalStep = currentStep === 4 || currentStep === 7 || currentStep === 8 || currentStep === 10 || currentStep === 13;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ordino-text">Enhanced QA Workflow Demo</h2>
            <p className="text-sm text-ordino-text-muted">
              Experience Ordino's comprehensive test automation workflow with realistic QA operations
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
                {currentStep > 0 && !isBlocked && (
                  <Button
                    variant="ghost"
                    onClick={() => triggerBlocker(sampleBlockers[0])}
                    size="sm"
                    className="border border-ordino-error/20 text-ordino-error hover:bg-ordino-error/10"
                  >
                    <AlertCircle size={16} />
                    Trigger Blocker (Demo)
                  </Button>
                )}
                <Button onClick={next} disabled={isComplete || isApprovalStep || isBlocked}>
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
            {/* Blocker Overlay */}
            {isBlocked && activeBlockers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="mb-4"
              >
                <BlockerDisplay
                  blocker={activeBlockers[0]}
                  onResolve={resolveBlocker}
                  onEscalate={escalate}
                />
              </motion.div>
            )}
            <Card className="min-h-[500px]">
              {/* Step header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-ordino-primary uppercase tracking-wider">
                    Step {currentStep} of 16
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
                    Ordino has successfully completed the enhanced QA workflow including requirements triage,
                    multi-level approvals, test data strategy, and automation script creation.
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
              Ready for Enhanced QA Workflow?
            </h3>
            <p className="text-ordino-text-muted max-w-md mx-auto mb-6">
              Watch how Ordino handles requirements triage, multi-level approvals, test data management,
              and comprehensive test automation with realistic QA practices.
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
