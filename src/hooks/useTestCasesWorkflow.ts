import { useState, useEffect, useCallback, useRef } from 'react';

export type TestCasesStepStatus = 'pending' | 'active' | 'completed';

export interface TestCasesWorkflowState {
  currentStep: number;
  steps: { id: number; status: TestCasesStepStatus }[];
  isPlaying: boolean;
  isComplete: boolean;
  testCasesApproved: boolean;
}

const TOTAL_STEPS = 6;
const AUTO_PLAY_DELAY = 3000;

export function useTestCasesWorkflow() {
  const [state, setState] = useState<TestCasesWorkflowState>({
    currentStep: 0,
    steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
      id: i + 1,
      status: 'pending' as TestCasesStepStatus,
    })),
    isPlaying: false,
    isComplete: false,
    testCasesApproved: false,
  });

  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateStepStatus = useCallback((stepId: number, status: TestCasesStepStatus) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, status } : step
      ),
    }));
  }, []);

  const start = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 1,
      isPlaying: true,
      isComplete: false,
      testCasesApproved: false,
    }));
    updateStepStatus(1, 'active');
  }, [updateStepStatus]);

  const next = useCallback(() => {
    setState(prev => {
      if (prev.currentStep >= TOTAL_STEPS) {
        return { ...prev, isComplete: true, isPlaying: false };
      }

      const nextStep = prev.currentStep + 1;
      updateStepStatus(prev.currentStep, 'completed');

      if (nextStep <= TOTAL_STEPS) {
        updateStepStatus(nextStep, 'active');
        return {
          ...prev,
          currentStep: nextStep,
        };
      }

      return {
        ...prev,
        currentStep: nextStep,
        isComplete: true,
        isPlaying: false,
      };
    });
  }, [updateStepStatus]);

  const reset = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    setState({
      currentStep: 0,
      steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
        id: i + 1,
        status: 'pending' as TestCasesStepStatus,
      })),
      isPlaying: false,
      isComplete: false,
      testCasesApproved: false,
    });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  const approveTestCases = useCallback(() => {
    setState(prev => ({
      ...prev,
      testCasesApproved: true,
    }));
  }, []);

  // Step 5 (Approval) blocks until testCasesApproved
  const isBlockingStep = state.currentStep === 5 && !state.testCasesApproved;

  // Auto-play logic
  useEffect(() => {
    if (state.isPlaying && !state.isComplete && state.currentStep > 0 && !isBlockingStep) {
      autoPlayTimerRef.current = setTimeout(() => {
        next();
      }, AUTO_PLAY_DELAY);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [state.isPlaying, state.isComplete, state.currentStep, isBlockingStep, next]);

  return {
    currentStep: state.currentStep,
    steps: state.steps,
    isPlaying: state.isPlaying,
    isComplete: state.isComplete,
    testCasesApproved: state.testCasesApproved,
    start,
    next,
    reset,
    toggleAutoPlay,
    approveTestCases,
  };
}
