import { useState, useCallback, useEffect, useRef } from 'react';

export type AutomationStepStatus = 'pending' | 'active' | 'completed';

export interface AutomationWorkflowState {
  currentStep: number;
  steps: {
    id: number;
    status: AutomationStepStatus;
  }[];
  isPlaying: boolean;
  isComplete: boolean;
  scriptsApproved: boolean;
}

const TOTAL_STEPS = 4;
const AUTO_PLAY_DELAY = 3000;

export function useAutomationWorkflow() {
  const [state, setState] = useState<AutomationWorkflowState>({
    currentStep: 0,
    steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
      id: i + 1,
      status: 'pending' as AutomationStepStatus,
    })),
    isPlaying: false,
    isComplete: false,
    scriptsApproved: false,
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
      scriptsApproved: false,
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
      scriptsApproved: false,
    });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 0) return prev;
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const approveScripts = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= TOTAL_STEPS) {
        return { ...prev, scriptsApproved: true, isComplete: true, isPlaying: false };
      }

      const newStep = prev.currentStep + 1;
      return {
        ...prev,
        scriptsApproved: true,
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

  // Auto-play effect — blocks on step 3 (Code Review) until scriptsApproved
  useEffect(() => {
    const isBlockingStep = state.currentStep === 3 && !state.scriptsApproved;

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
  }, [state.isPlaying, state.isComplete, state.currentStep, state.scriptsApproved, next]);

  return {
    ...state,
    start,
    next,
    reset,
    toggleAutoPlay,
    approveScripts,
  };
}
