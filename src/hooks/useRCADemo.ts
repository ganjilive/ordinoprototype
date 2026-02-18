import { useState, useCallback, useEffect, useRef } from 'react';

export type RCAStepStatus = 'pending' | 'active' | 'completed';

export interface RCAWorkflowState {
  currentStep: number;
  steps: {
    id: number;
    status: RCAStepStatus;
  }[];
  isPlaying: boolean;
  isComplete: boolean;
  humanCollabCompleted: boolean;
}

const TOTAL_STEPS = 7;
const AUTO_PLAY_DELAY = 3000;

export function useRCADemo() {
  const [state, setState] = useState<RCAWorkflowState>({
    currentStep: 0,
    steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
      id: i + 1,
      status: 'pending' as RCAStepStatus,
    })),
    isPlaying: false,
    isComplete: false,
    humanCollabCompleted: false,
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
      humanCollabCompleted: false,
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
      humanCollabCompleted: false,
    });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep === 0) return prev;
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const completeHumanCollaboration = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= TOTAL_STEPS) {
        return { ...prev, humanCollabCompleted: true, isComplete: true, isPlaying: false };
      }

      const newStep = prev.currentStep + 1;
      return {
        ...prev,
        humanCollabCompleted: true,
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

  // Auto-play effect — blocks on step 5 (human collaboration)
  useEffect(() => {
    const isBlockingStep = state.currentStep === 5 && !state.humanCollabCompleted;

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
  }, [state.isPlaying, state.isComplete, state.currentStep, state.humanCollabCompleted, next]);

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
    completeHumanCollaboration,
  };
}
