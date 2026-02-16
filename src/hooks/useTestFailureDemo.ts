import { useState, useCallback, useEffect, useRef } from 'react';

export type FailureStepStatus = 'pending' | 'active' | 'completed';

export interface FailureWorkflowState {
  currentStep: number;
  steps: {
    id: number;
    status: FailureStepStatus;
  }[];
  isPlaying: boolean;
  isComplete: boolean;

  // Test failure tracking
  failedTestCases: string[];
  investigationComplete: boolean;
  bugDetected: boolean;
  bugReported: boolean;
  developersNotified: boolean;

  // Chat messages for step 6
  chatMessages: FailureChatMessage[];
}

export interface FailureChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const TOTAL_STEPS = 6;
const AUTO_PLAY_DELAY = 3000;

export function useTestFailureDemo() {
  const [state, setState] = useState<FailureWorkflowState>({
    currentStep: 0,
    steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
      id: i + 1,
      status: 'pending' as FailureStepStatus,
    })),
    isPlaying: false,
    isComplete: false,

    // Test failure tracking
    failedTestCases: [],
    investigationComplete: false,
    bugDetected: false,
    bugReported: false,
    developersNotified: false,

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
      failedTestCases: [],
      investigationComplete: false,
      bugDetected: false,
      bugReported: false,
      developersNotified: false,
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
      failedTestCases: [],
      investigationComplete: false,
      bugDetected: false,
      bugReported: false,
      developersNotified: false,
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

  // Mark investigation as complete
  const completeInvestigation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      investigationComplete: true,
      bugDetected: true,
    }));
  }, []);

  // Mark bug as reported
  const markBugReported = useCallback(() => {
    setState((prev) => ({
      ...prev,
      bugReported: true,
    }));
  }, []);

  // Mark developers as notified
  const markDevelopersNotified = useCallback(() => {
    setState((prev) => ({
      ...prev,
      developersNotified: true,
    }));
  }, []);

  // Add chat message
  const addChatMessage = useCallback((message: FailureChatMessage) => {
    setState((prev) => ({
      ...prev,
      chatMessages: [...prev.chatMessages, message],
    }));
  }, []);

  // Auto-play effect
  useEffect(() => {
    // Don't auto-advance on interactive step (step 6)
    const isBlockingStep = state.currentStep === 6;

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
    completeInvestigation,
    markBugReported,
    markDevelopersNotified,
    addChatMessage,
  };
}
