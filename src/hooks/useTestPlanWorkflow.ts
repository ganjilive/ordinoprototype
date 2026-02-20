import { useState, useCallback, useEffect, useRef } from 'react';

export type TestPlanStepStatus = 'pending' | 'active' | 'completed';

export interface TestPlanWorkflowState {
  currentStep: number;
  steps: {
    id: number;
    status: TestPlanStepStatus;
  }[];
  isPlaying: boolean;
  isComplete: boolean;
  collaborationComplete: boolean;
  planApproved: boolean;
}

const TOTAL_STEPS = 4;
const AUTO_PLAY_DELAY = 3000;

export function useTestPlanWorkflow() {
  const [state, setState] = useState<TestPlanWorkflowState>({
    currentStep: 0,
    steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
      id: i + 1,
      status: 'pending' as TestPlanStepStatus,
    })),
    isPlaying: false,
    isComplete: false,
    collaborationComplete: false,
    planApproved: false,
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
      collaborationComplete: false,
      planApproved: false,
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
      collaborationComplete: false,
      planApproved: false,
    });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 0) return prev;
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const completeCollaboration = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= TOTAL_STEPS) {
        return { ...prev, collaborationComplete: true, isComplete: true, isPlaying: false };
      }

      const newStep = prev.currentStep + 1;
      return {
        ...prev,
        collaborationComplete: true,
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

  const approvePlan = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= TOTAL_STEPS) {
        return { ...prev, planApproved: true, isComplete: true, isPlaying: false };
      }

      const newStep = prev.currentStep + 1;
      return {
        ...prev,
        planApproved: true,
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

  // Auto-play effect — blocks on step 2 until collaborationComplete, and step 4 until planApproved
  useEffect(() => {
    const isBlockingStep =
      (state.currentStep === 2 && !state.collaborationComplete) ||
      (state.currentStep === 4 && !state.planApproved);

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
  }, [state.isPlaying, state.isComplete, state.currentStep, state.collaborationComplete, state.planApproved, next]);

  return {
    ...state,
    start,
    next,
    reset,
    toggleAutoPlay,
    completeCollaboration,
    approvePlan,
  };
}
