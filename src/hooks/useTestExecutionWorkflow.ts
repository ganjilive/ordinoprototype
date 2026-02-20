import { useState, useEffect, useCallback, useRef } from 'react';

export type TestExecutionStepStatus = 'pending' | 'active' | 'completed';

export interface TestExecutionWorkflowState {
  currentStep: number;
  steps: { id: number; status: TestExecutionStepStatus }[];
  isPlaying: boolean;
  isComplete: boolean;
}

const TOTAL_STEPS = 3;
const AUTO_PLAY_DELAY = 3000;

export function useTestExecutionWorkflow() {
  const [state, setState] = useState<TestExecutionWorkflowState>({
    currentStep: 0,
    steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
      id: i + 1,
      status: 'pending' as TestExecutionStepStatus,
    })),
    isPlaying: false,
    isComplete: false,
  });

  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateStepStatus = useCallback((stepId: number, status: TestExecutionStepStatus) => {
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
        status: 'pending' as TestExecutionStepStatus,
      })),
      isPlaying: false,
      isComplete: false,
    });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (state.isPlaying && !state.isComplete && state.currentStep > 0) {
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
  }, [state.isPlaying, state.isComplete, state.currentStep, next]);

  return {
    currentStep: state.currentStep,
    steps: state.steps,
    isPlaying: state.isPlaying,
    isComplete: state.isComplete,
    start,
    next,
    reset,
    toggleAutoPlay,
  };
}
