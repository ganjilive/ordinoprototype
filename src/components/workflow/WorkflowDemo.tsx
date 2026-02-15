import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, RotateCcw, Pause, PlayCircle, AlertCircle, Clock, Zap, DollarSign } from 'lucide-react';
import { Button, Card } from '../common';
import { WorkflowTimeline } from './WorkflowTimeline';
import { useWorkflowDemo } from '../../hooks/useWorkflowDemo';
import {
  JiraRequirement,
  OrdinoThinking,
  TriageApproval,
  TestArtifactLookup,
  TestDesignDrafting,
  TestDesignReview,
  TestArtifactCreation,
  TestDataStrategy,
  AutomationScriptDrafting,
  AutomationScriptApproval,
  AutomationScriptCreation,
  NotificationToast,
  BlockerDisplay,
} from './steps';
import { sampleBlockers } from '../../data/mockData';

const stepDescriptions = [
  '',
  'A new requirement has been detected in Jira. Ordino is ready to analyze it.',
  'Ordino AI is analyzing the requirement and performing triage assessment.',
  'Multi-level approval process to validate triage results and authorize test design.',
  'Looking up existing test artifacts to understand current coverage and identify gaps.',
  'Drafting test design with scenarios, paths, test cases, and coverage analysis.',
  'Combined peer and lead review of the drafted test design.',
  'Creating approved test plan, test design, and test cases in the repository.',
  'Defining test data requirements, generation strategy, and privacy compliance.',
  'Drafting test automation scripts based on approved design.',
  'Review the drafted automation scripts. Approve to create them in the repository.',
  'Creating approved automation scripts in the configured test script repository.',
  'Notifying stakeholders with a summary of what was accomplished.',
];

// Metrics for each step (Manual in minutes, Ordino in seconds)
const stepTimeMetrics = [
  { manual: 0, ordino: 0 }, // Step 0 (Start)
  { manual: 5, ordino: 0.1 }, // Step 1: Detect
  { manual: 45, ordino: 5 }, // Step 2: Analyze
  { manual: 30, ordino: 1 }, // Step 3: Triage Approval
  { manual: 60, ordino: 2 }, // Step 4: Lookup
  { manual: 120, ordino: 15 }, // Step 5: Draft Design
  { manual: 45, ordino: 5 }, // Step 6: Design Review
  { manual: 30, ordino: 2 }, // Step 7: Create Artifacts
  { manual: 45, ordino: 3 }, // Step 8: Data Strategy
  { manual: 180, ordino: 20 }, // Step 9: Draft Scripts
  { manual: 60, ordino: 5 }, // Step 10: Script Approval
  { manual: 30, ordino: 3 }, // Step 11: Create Scripts
  { manual: 10, ordino: 1 }, // Step 12: Notification
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
        return <TriageApproval onApprove={next} onReject={reset} />;
      case 4:
        return <TestArtifactLookup />;
      case 5:
        return <TestDesignDrafting />;
      case 6:
        return <TestDesignReview onApprove={next} onReject={reset} />;
      case 7:
        return <TestArtifactCreation />;
      case 8:
        return <TestDataStrategy />;
      case 9:
        return <AutomationScriptDrafting />;
      case 10:
        return <AutomationScriptApproval onApprove={next} onReject={reset} />;
      case 11:
        return <AutomationScriptCreation />;
      case 12:
        return <NotificationToast />;
      default:
        return null;
    }
  };

  // Determine which steps should disable the Next button (approval steps or blocked)
  // Steps 3 (Triage Approval), 6 (Review), 10 (Script Approval) are approval steps
  const isApprovalStep = currentStep === 3 || currentStep === 6 || currentStep === 10;

  // Calculate cumulative time
  const cumulativeManualMinutes = stepTimeMetrics
    .slice(0, currentStep + 1)
    .reduce((acc, curr) => acc + curr.manual, 0);

  const cumulativeOrdinoSeconds = stepTimeMetrics
    .slice(0, currentStep + 1)
    .reduce((acc, curr) => acc + curr.ordino, 0);

  const hoursSaved = (cumulativeManualMinutes / 60).toFixed(1);
  const costSaved = (cumulativeManualMinutes / 60 * 150).toFixed(0); // Assuming $150/hr

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ordino-text">Enhanced QA Workflow Demo</h2>
            <p className="text-sm text-ordino-text-muted">
              Experience Ordino's streamlined 12-step test automation workflow
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
                <p className="text-xl font-mono text-ordino-text-muted">{cumulativeManualMinutes} min</p>
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
                <p className="text-xl font-mono text-ordino-primary font-bold">{cumulativeOrdinoSeconds.toFixed(1)} sec</p>
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
                    Step {currentStep} of 12
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-gradient-to-br from-ordino-success/10 to-ordino-primary/5 rounded-xl border border-ordino-success/20 shadow-lg"
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ordino-success/20 text-ordino-success mb-4">
                      <Zap size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-ordino-text mb-2">
                      Workflow Complete!
                    </h3>
                    <p className="text-ordino-text-muted">
                      You just completed a comprehensive test automation workflow.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-ordino-bg/50 rounded-lg">
                      <p className="text-sm text-ordino-text-muted">Total Time Saved</p>
                      <p className="text-2xl font-bold text-ordino-success">{hoursSaved} Hours</p>
                    </div>
                    <div className="text-center p-3 bg-ordino-bg/50 rounded-lg">
                      <p className="text-sm text-ordino-text-muted">Speed Improvement</p>
                      <p className="text-2xl font-bold text-ordino-primary">{(cumulativeManualMinutes * 60 / cumulativeOrdinoSeconds).toFixed(0)}x Faster</p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ordino-primary/20 flex items-center justify-center">
              <Play size={32} className="text-ordino-primary ml-1" />
            </div>
            <h3 className="text-2xl font-bold text-ordino-text mb-2">
              Ready for Streamlined QA Workflow?
            </h3>
            <p className="text-ordino-text-muted max-w-md mx-auto mb-6">
              Watch how Ordino handles requirements analysis, test design drafting, combined reviews,
              artifact creation, and test automation in a streamlined 12-step workflow.
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
