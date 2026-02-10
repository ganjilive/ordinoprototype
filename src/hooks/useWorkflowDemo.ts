import { useState, useCallback, useEffect, useRef } from 'react';
import type { Blocker, RevisionRequest, ApprovalHistoryEntry } from '../types';

export type WorkflowStepStatus = 'pending' | 'active' | 'completed';

export interface WorkflowState {
  currentStep: number;
  steps: {
    id: number;
    status: WorkflowStepStatus;
  }[];
  isPlaying: boolean;
  isComplete: boolean;

  // Approval tracking
  currentApprovalLevel: number;
  maxApprovalLevels: number;
  approvalHistory: ApprovalHistoryEntry[];

  // Revision tracking
  revisionRequests: RevisionRequest[];
  isRevisionRequested: boolean;

  // Blocker tracking
  activeBlockers: Blocker[];
  isBlocked: boolean;
  escalationActive: boolean;

  // Step completions
  triageCompleted: boolean;
  peerReviewCompleted: boolean;
  testDataStrategyApproved: boolean;
}

const TOTAL_STEPS = 16;
const AUTO_PLAY_DELAY = 3000;

export function useWorkflowDemo() {
  const [state, setState] = useState<WorkflowState>({
    currentStep: 0,
    steps: Array.from({ length: TOTAL_STEPS }, (_, i) => ({
      id: i + 1,
      status: 'pending' as WorkflowStepStatus,
    })),
    isPlaying: false,
    isComplete: false,

    // Approval tracking
    currentApprovalLevel: 0,
    maxApprovalLevels: 3,
    approvalHistory: [],

    // Revision tracking
    revisionRequests: [],
    isRevisionRequested: false,

    // Blocker tracking
    activeBlockers: [],
    isBlocked: false,
    escalationActive: false,

    // Step completions
    triageCompleted: false,
    peerReviewCompleted: false,
    testDataStrategyApproved: false,
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
      currentApprovalLevel: 0,
      maxApprovalLevels: 3,
      approvalHistory: [],
      revisionRequests: [],
      isRevisionRequested: false,
      activeBlockers: [],
      isBlocked: false,
      escalationActive: false,
      triageCompleted: false,
      peerReviewCompleted: false,
      testDataStrategyApproved: false,
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
      currentApprovalLevel: 0,
      maxApprovalLevels: 3,
      approvalHistory: [],
      revisionRequests: [],
      isRevisionRequested: false,
      activeBlockers: [],
      isBlocked: false,
      escalationActive: false,
      triageCompleted: false,
      peerReviewCompleted: false,
      testDataStrategyApproved: false,
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

  const requestRevision = useCallback((_stepId: number, request: RevisionRequest) => {
    setState((prev) => ({
      ...prev,
      revisionRequests: [...prev.revisionRequests, request],
      isRevisionRequested: true,
    }));
  }, []);

  const triggerBlocker = useCallback((blocker: Blocker) => {
    setState((prev) => ({
      ...prev,
      activeBlockers: [...prev.activeBlockers, blocker],
      isBlocked: true,
      isPlaying: false,
    }));
  }, []);

  const resolveBlocker = useCallback((blockerId: string) => {
    setState((prev) => ({
      ...prev,
      activeBlockers: prev.activeBlockers.filter((b) => b.id !== blockerId),
      isBlocked: prev.activeBlockers.length > 1,
    }));
  }, []);

  const escalate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      escalationActive: true,
    }));
  }, []);

  const advanceApprovalLevel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentApprovalLevel: prev.currentApprovalLevel + 1,
    }));
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (state.isPlaying && !state.isComplete && !state.isBlocked) {
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
  }, [state.isPlaying, state.isComplete, state.isBlocked, next]);

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
    requestRevision,
    triggerBlocker,
    resolveBlocker,
    escalate,
    advanceApprovalLevel,
  };
}
