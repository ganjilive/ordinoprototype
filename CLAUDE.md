# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ordino is a QA workflow automation prototype that demonstrates an AI-powered test design and automation workflow. It's a React + TypeScript + Vite application showcasing multiple QA processes: a 12-step test scripting workflow, test execution, test failure investigation, and root cause analysis.

## Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint check
npm run preview  # Preview production build locally
```

There are no test commands — this is a demo prototype with no test suite.

## Architecture

### Application Structure

The app uses React Router with lazy-loaded pages wrapped in a `MainLayout`. Each demo page is a thin wrapper that renders its corresponding component from `src/components/workflow/`:

- `/` - Dashboard with metrics, charts, activity feed
- `/demo` - Test Scripting Demo: 12-step QA workflow for test design and automation
- `/execution` - Test Execution Demo: 7-step pipeline execution workflow
- `/failure` - Test Failure Demo: failure detection and investigation workflow
- `/rca` - RCA Demo: 7-step root cause analysis workflow
- `/history` - Historical records and traceability
- `/settings` - Integration and project configuration

### Demo Architecture Pattern

Each interactive demo follows the same architecture:

```
src/pages/XxxDemo.tsx           → thin wrapper, just renders <XxxDemoComponent />
src/components/workflow/
  XxxDemo.tsx                   → orchestrator: controls, metrics cards, timeline sidebar, step content
  XxxTimeline.tsx               → sidebar timeline with animated progress line and step circles
src/hooks/useXxxDemo.ts         → state machine: currentStep, steps[], isPlaying, isComplete
src/components/workflow/steps/
  xxx/StepComponent.tsx         → individual step visualizations
  xxx/index.ts                  → barrel export
src/data/xxxMockData.ts         → flat-exported scenario data
```

**State machine hooks**: `useWorkflowDemo` (12-step scripting), `useTestExecutionDemo` (7-step execution), `useTestFailureDemo`, `useRCADemo`.

All hooks expose: `currentStep`, `steps`, `isPlaying`, `isComplete`, `start`, `next`, `reset`, `toggleAutoPlay`. Blocking steps disable `next` and auto-play; unblocking is done via a dedicated callback (e.g., `onApprove`, `completeHumanCollaboration`).

**Auto-play**: A `setInterval` in a `useEffect` calls `next()` every 3000ms when `isPlaying` is true and the current step is not a blocking step.

### Test Scripting Demo (Core Feature)

Managed by `useWorkflowDemo.ts`, which has extra state beyond the base pattern:
- **Blocker system**: `triggerBlocker()` / `resolveBlocker()` set `isBlocked: true`, halting auto-play and disabling Next. Blockers are displayed by `BlockerDisplay.tsx`.
- **Approval tracking**: `approvalHistory`, `revisionRequests` stored in state.
- **12 steps**: Requirement Detected → Analyze + Triage → Triage Approval → Find Artifacts → Draft Test Design → Review → Create Artifacts → Draft Test Data → Draft Automation → Review Automation → Create Automation → Notify Stakeholders.
- Approval steps (3, 6, 10) call `onApprove(next)` / `onReject(reset)` from within the step component.

### Step Components Pattern

Step components in `src/components/workflow/steps/` use a multi-phase pattern with self-contained timers:

```typescript
const mountedRef = useRef(true);
const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  mountedRef.current = true;
  return () => {
    mountedRef.current = false;
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
  };
}, []);

// Each phase has its own useEffect that guards with: if (!mountedRef.current) return;
```

`mountedRef` is critical — without it, unmounting a step mid-animation causes state-update-on-unmounted-component errors. Always include it when writing new step components.

Phases advance by setting `currentPhase` and tracking `completedPhases` (array of completed phase indices). Render conditionally: `{currentPhase >= 1 && <Phase1 />}` or `{completedPhases.includes(0) && <PostPhase0 />}`.

### Theming

Custom Tailwind theme defined in `src/index.css` using CSS variables:
- `ordino-bg`, `ordino-card` - Background colors (dark theme)
- `ordino-primary` (#f97316 orange), `ordino-secondary` (#3b82f6 blue)
- `ordino-success`, `ordino-warning`, `ordino-error` - Status colors
- `ordino-text`, `ordino-text-muted`, `ordino-border`

### Animation Utilities

`src/utils/animations.ts` exports reusable Framer Motion variants:
- `staggerContainerVariants` / `slideUpVariants` — staggered list entrances (used on Dashboard, History)
- `workflowStepVariants` — pending/active/completed states
- `glowPulseVariants`, `spinnerVariants`, `fadeInVariants`

Step components use inline `motion` variants rather than these shared ones. Use the shared variants for page-level layouts.

### Key Libraries

- **framer-motion** - All animations and transitions
- **lucide-react** - Icon library
- **recharts** - Dashboard charts
- **react-router-dom** - Routing with lazy loading
- **clsx** + **tailwind-merge** - Conditional class composition via `cn()` in `src/utils/helpers.ts`

### Data Layer

Mock data files in `src/data/` use flat named exports (not default exports):
- `mockData.ts` - Test Scripting Demo: test plans, designs, cases, triage analysis, approval chains, automation scripts
- `testExecutionMockData.ts` - Test Execution Demo: test suite, results, pipeline stages, commit details, time metrics
- `testFailureMockData.ts` - Test Failure Demo scenario data
- `rcaMockData.ts` - RCA Demo: failing builds, analysis steps, Slack messages, human responses, RCA report

All types are in `src/types/index.ts`. When adding a new demo, append its types to that file rather than creating separate type files.

### Common Components

`src/components/common/` exports: `Button` (variants: `primary`, `secondary`, `ghost`; sizes: `sm`, `md`, `lg`), `Card`, `Badge` (variants: `primary`, `success`, `warning`, `error`, `info`), `Modal`, `Logo`.

## QA Domain Context

This prototype demonstrates ISTQB/IEEE 829 compliant QA processes. When modifying workflow steps, maintain proper QA terminology and process ordering:
- Test design (scenarios, paths, conditions) must be drafted BEFORE test cases
- Test cases flow from test design, not vice versa
- Traceability links requirements → test designs → test cases

## UI/UX Guidelines

- Approval animations should show state changes clearly (e.g., green checkmark icon) without filling entire elements with color
- Labels should be unambiguous; add subtitles when needed (e.g., "Testing Effort" has subtitle "without automation")
- Blocking steps should show a clear visual indicator in the step header (e.g., "— Awaiting Human Input" badge)
- ROI metrics cards (Manual Time / Ordino Time / Est. Cost Savings) are shown for all demos; cost = `(manualMinutes / 60) * 150` at $150/hr
