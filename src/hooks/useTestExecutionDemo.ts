import { useState, useCallback, useEffect, useRef } from 'react';
import type { TestExecution, BugReport, PipelineStage, ExecutionChatMessage } from '../types';
import { testSuite, testResults, pipelineStages } from '../data/testExecutionMockData';

export type ExecutionStepStatus = 'pending' | 'active' | 'completed';

export interface ExecutionWorkflowState {
  currentStep: number;
  steps: {
    id: number;
    status: ExecutionStepStatus;
  }[];
  isPlaying: boolean;
  isComplete: boolean;

  // Commit approval for step 4
  commitApprovalStatus: 'pending' | 'approved' | 'rejected';

  // Test execution tracking
  testExecutions: TestExecution[];
  testsExecuted: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;

  // Bug tracking
  bugsDiscovered: BugReport[];

  // Pipeline status
  pipelineStatus: 'pending' | 'running' | 'success' | 'failed';
  pipelineStages: PipelineStage[];

  // Chat messages for step 8
  chatMessages: ExecutionChatMessage[];
}

const TOTAL_STEPS = 8;
const AUTO_PLAY_DELAY = 3000;

export function useTestExecutionDemo() {
  const [state, setState] = useState<ExecutionWorkflowState>({
    currentStep: 0,
    steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
      id: i + 1,
      status: 'pending' as ExecutionStepStatus,
    })),
    isPlaying: false,
    isComplete: false,

    // Commit approval
    commitApprovalStatus: 'pending',

    // Test execution
    testExecutions: testSuite.map(t => ({ ...t, status: 'pending' as const })),
    testsExecuted: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,

    // Bugs
    bugsDiscovered: [],

    // Pipeline
    pipelineStatus: 'pending',
    pipelineStages: pipelineStages.map(s => ({ ...s, status: 'pending' as const })),

    // Chat
    chatMessages: [],
  });

  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setState({
      currentStep: 1,
      steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
        id: i + 1,
        status: i === 0 ? 'active' : 'pending',
      })),
      isPlaying: false,
      isComplete: false,
      commitApprovalStatus: 'pending',
      testExecutions: testSuite.map(t => ({ ...t, status: 'pending' as const })),
      testsExecuted: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      bugsDiscovered: [],
      pipelineStatus: 'pending',
      pipelineStages: pipelineStages.map(s => ({ ...s, status: 'pending' as const })),
      chatMessages: [],
    });
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= TOTAL_STEPS) {
        return { ...prev, isComplete: true, isPlaying: false };
      }

      const newStep = prev.currentStep + 1;
      return {
        ...prev,
        currentStep: newStep,
        steps: prev.steps.map((step) => ({
          ...step,
          status:
            step.id < newStep
              ? 'completed'
              : step.id === newStep
              ? 'active'
              : 'pending',
        })),
        isComplete: newStep > TOTAL_STEPS,
      };
    });
  }, []);

  const reset = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    setState({
      currentStep: 0,
      steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
        id: i + 1,
        status: 'pending',
      })),
      isPlaying: false,
      isComplete: false,
      commitApprovalStatus: 'pending',
      testExecutions: testSuite.map(t => ({ ...t, status: 'pending' as const })),
      testsExecuted: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      bugsDiscovered: [],
      pipelineStatus: 'pending',
      pipelineStages: pipelineStages.map(s => ({ ...s, status: 'pending' as const })),
      chatMessages: [],
    });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 0) {
        return prev;
      }
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  // Update test execution status
  const updateTestExecution = useCallback((testId: string, updates: Partial<TestExecution>) => {
    setState((prev) => {
      const newExecutions = prev.testExecutions.map((t) =>
        t.id === testId ? { ...t, ...updates } : t
      );

      const passed = newExecutions.filter(t => t.status === 'passed').length;
      const failed = newExecutions.filter(t => t.status === 'failed').length;
      const skipped = newExecutions.filter(t => t.status === 'skipped').length;
      const executed = passed + failed + skipped;

      return {
        ...prev,
        testExecutions: newExecutions,
        testsExecuted: executed,
        passedTests: passed,
        failedTests: failed,
        skippedTests: skipped,
      };
    });
  }, []);

  // Complete all test executions with predetermined results
  const completeTestExecutions = useCallback(() => {
    setState((prev) => {
      const newExecutions = prev.testExecutions.map((t) => ({
        ...t,
        ...testResults[t.id],
      }));

      const passed = newExecutions.filter(t => t.status === 'passed').length;
      const failed = newExecutions.filter(t => t.status === 'failed').length;
      const skipped = newExecutions.filter(t => t.status === 'skipped').length;

      return {
        ...prev,
        testExecutions: newExecutions,
        testsExecuted: newExecutions.length,
        passedTests: passed,
        failedTests: failed,
        skippedTests: skipped,
      };
    });
  }, []);

  // Add discovered bugs
  const addBugs = useCallback((bugs: BugReport[]) => {
    setState((prev) => ({
      ...prev,
      bugsDiscovered: bugs,
    }));
  }, []);

  // Approve commit
  const approveCommit = useCallback(() => {
    setState((prev) => ({
      ...prev,
      commitApprovalStatus: 'approved',
    }));
  }, []);

  // Reject commit
  const rejectCommit = useCallback(() => {
    setState((prev) => ({
      ...prev,
      commitApprovalStatus: 'rejected',
    }));
  }, []);

  // Update pipeline stage
  const updatePipelineStage = useCallback((stageId: string, status: PipelineStage['status']) => {
    setState((prev) => ({
      ...prev,
      pipelineStages: prev.pipelineStages.map((s) =>
        s.id === stageId ? { ...s, status } : s
      ),
    }));
  }, []);

  // Complete pipeline
  const completePipeline = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pipelineStatus: 'success',
      pipelineStages: prev.pipelineStages.map(s => ({ ...s, status: 'success' as const })),
    }));
  }, []);

  // Add chat message
  const addChatMessage = useCallback((message: ExecutionChatMessage) => {
    setState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, message],
    }));
  }, []);

  // Auto-play effect
  useEffect(() => {
    // Don't auto-advance on approval step (step 4) or interactive step (step 8)
    const isBlockingStep = state.currentStep === 4 || state.currentStep === 8;

    if (state.isPlaying && !state.isComplete && !isBlockingStep) {
      autoPlayRef.current = setInterval(() => {
        next();
      }, AUTO_PLAY_DELAY);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [state.isPlaying, state.isComplete, state.currentStep, next]);

  // Stop auto-play when complete
  useEffect(() => {
    if (state.isComplete && state.isPlaying) {
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, [state.isComplete, state.isPlaying]);

  return {
    ...state,
    start,
    next,
    reset,
    toggleAutoPlay,
    updateTestExecution,
    completeTestExecutions,
    addBugs,
    approveCommit,
    rejectCommit,
    updatePipelineStage,
    completePipeline,
    addChatMessage,
  };
}
