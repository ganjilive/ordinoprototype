# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Ordino?

Ordino is a **demo/prototype** — not a production app. It showcases how AI could power QA (Quality Assurance) workflows. There is no backend, no real data, and no test suite. Everything on screen is driven by mock data and animated state machines.

Built with: **React + TypeScript + Vite**, styled with **Tailwind CSS** (dark theme), animated with **Framer Motion**.

---

## Commands

```bash
npm run dev      # Start local dev server at localhost:5173 (hot reload enabled)
npm run build    # Type-check with TypeScript, then bundle for production
npm run lint     # Run ESLint to catch code issues
npm run preview  # Serve the production build locally to test it
```

There are no test commands — this is a demo prototype with no test suite.

---

## Pages & Routes

Two distinct demo types exist, with different architecture patterns:

### Workflow Demos (stepped, animated)

**Current Navigation (Primary Workflows):**
| Route | What it shows |
|---|---|
| `/` | Dashboard — charts, metrics, activity feed |
| `/requirement-analysis` | Requirements — AI-powered requirement analysis workflow |
| `/test-plan` | Test Plan — test planning and strategy workflow |
| `/test-design` | Test Design — test design and scenario creation workflow |
| `/test-case-generation` | Test Cases — 6-step test case generation workflow |
| `/automation-script-generation` | Automation — automation script generation workflow |
| `/test-execution` | Test Execution — test execution workflow |
| `/results-generation` | Test Results — test results analysis workflow |
| `/root-cause-analysis` | RCA — root cause analysis workflow |
| `/auto-healing-tests` | Auto Heal — AI-powered test healing workflow |
| `/history` | Historical records and traceability view |
| `/settings` | Integration and project configuration |

**Legacy Demo Routes (still functional):**
| Route | What it shows |
|---|---|
| `/demo` | Test Scripting — 12-step workflow for designing & automating tests |
| `/execution` | Test Execution Demo — 7-step CI/CD pipeline run |
| `/failure` | Test Failure Demo — failure detection and investigation |
| `/rca` | RCA Demo — 7-step deep-dive into why a build broke |
| `/heal` | Auto-Heal Demo — 7-step AI-powered self-healing of broken tests |

### Platform Integration Demos (free-form chat)
| Route | What it shows |
|---|---|
| `/slack` | Ordino as a Slack bot in `#qa-alerts` — CI failure alert + keyword chat |
| `/teams` | Ordino as a Teams bot — Sprint regression report + keyword chat |
| `/jira` | Auto-created Jira bug ticket QA-847 with RCA comment + comment interaction |
| `/vscode` | VS Code with coverage gutter on `auth.test.ts` + Ordino extension panel |

All pages are **lazy-loaded** and wrapped in a shared `MainLayout` (sidebar + header).

---

## Architecture: Workflow Demos

Every stepped demo follows this four-layer pattern:

```
src/pages/XxxDemo.tsx                    → Thin wrapper, just renders the component
src/components/workflow/XxxDemo.tsx      → Main UI: playback controls, metrics, timeline + step content
src/components/workflow/XxxTimeline.tsx  → Left sidebar with animated step-progress circles
src/hooks/useXxxDemo.ts                  → State machine: tracks current step, controls playback
src/components/workflow/steps/xxx/       → One component per step (the content shown on screen)
src/data/xxxMockData.ts                  → All fake data the steps display
```

### The State Machine Hook

All workflow hooks expose the same interface:

```
currentStep      — active step number (0 = not started)
steps[]          — array of steps with status: 'pending' | 'active' | 'completed'
isPlaying        — whether auto-play is running
isComplete       — whether the final step has been passed
start()          — begin from step 1
next()           — advance manually
reset()          — return to unstarted state
toggleAutoPlay() — turn auto-play on/off
```

**Available hooks:**
- Legacy demo hooks: `useWorkflowDemo` (12 steps), `useTestExecutionDemo` (7), `useTestFailureDemo`, `useRCADemo` (7), `useAutoHealDemo` (7)
- New workflow hooks: `useRequirementsWorkflow`, `useTestPlanWorkflow`, `useTestDesignWorkflow`, `useTestCasesWorkflow` (6 steps), `useAutomationWorkflow`, `useTestExecutionWorkflow`, `useTestResultsWorkflow`, `useRCAWorkflow`, `useAutoHealingWorkflow`

The naming pattern for new hooks is `use[Name]Workflow`, while legacy hooks use `use[Name]Demo`. Both follow the same state machine interface.

### Auto-Play

Advances automatically every **3 seconds** via `setInterval`. Pauses at **blocking steps** that require human interaction. Blocking callbacks: `onApprove`, `onReject`, `completeHumanCollaboration`, `approveHealing`.

### Test Scripting Demo (`/demo`) — Extra Complexity

The flagship demo has two features the others don't:

- **Blocker system** — `triggerBlocker()` freezes the demo and shows a `BlockerDisplay.tsx` overlay; `resolveBlocker()` clears it.
- **Approval tracking** — `approvalHistory` and `revisionRequests` are stored in hook state and persist across steps.

**12 steps:** Requirement Detected → Analyze + Triage → **Triage Approval** → Find Artifacts → Draft Test Design → **Review** → Create Artifacts → Draft Test Data → Draft Automation → **Review Automation** → Create Automation → Notify Stakeholders

Steps 3, 6, and 10 (bold) are approval gates where the component calls `onApprove(next)` or `onReject(reset)`.

### Writing Step Components

Each step animates through internal **phases** ("loading" → "results appear" → "done").

**Always include a `mountedRef`** to prevent state updates after unmount:

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
// Check if (!mountedRef.current) return; at the top of every phase's useEffect
```

**Track phases with two state values:**
- `currentPhase` — drives timers
- `completedPhases` — array of finished phase indices, drives what's visible

```tsx
{currentPhase >= 1 && <PhaseOneContent />}
{completedPhases.includes(0) && <SomethingAfterPhase0 />}
```

---

## Architecture: Platform Integration Demos

No stepped workflow, no hooks, no timeline. Pure free-form chat/comment interaction inside a realistic platform UI mockup.

```
src/pages/XxxDemo.tsx                        → Thin wrapper
src/components/platform/XxxDemo.tsx          → Full platform UI + state (useState only, no custom hook)
src/components/platform/xxx/                 → Sub-components (sidebar, message list, input, cards)
src/data/xxxMockData.ts                      → Pre-populated messages + keyword response map
src/utils/platformChat.ts                    → Shared matchResponse() function
```

### Keyword Matching (`src/utils/platformChat.ts`)

```typescript
matchResponse(input: string, responses: Record<string, string>): string
```

Response keys are pipe-separated keyword lists: `"failure|failing|failed"`. The function lowercases the input and returns the first match. If nothing matches, returns a generic fallback. Mock data files export a `xxxKeywordResponses` record and a `xxxSuggestedPrompts` array.

### Platform Demo Layout

All platform demos use `h-[calc(100vh-140px)]` to fill available height (accounts for the 64px header + 24px top/bottom padding from `MainLayout`'s `<main className="flex-1 p-6">`).

### Chat Interaction Pattern

All platform demos follow the same interaction flow:
1. User types or clicks a suggested prompt chip
2. User message appears immediately
3. After 1500ms, Ordino responds (same `matchResponse` logic)

**Use `useRef` for message IDs** — never `Date.now()` in render/event handlers (ESLint rule `react-hooks/purity` flags it). Use an `idCounterRef` pattern:
```typescript
const idCounterRef = useRef(0);
const nextId = () => { idCounterRef.current += 1; return idCounterRef.current; };
```

### VS Code Demo — 4-Panel Layout

```
[ActivityBar 48px] [FileExplorer 176px] [Editor flex-1] [ExtensionPanel 320px]
```

Coverage gutter: a 6px colored strip between line numbers and code. Line rows get a subtle tint on uncovered lines (`bg-red-500/5`). Coverage statuses: `'covered'` (green) | `'uncovered'` (red) | `'partial'` (yellow) | `'none'` (transparent).

---

## Sidebar Navigation Structure

Two groups, defined in `src/components/layout/Sidebar.tsx`:

1. **`workflowNavItems`** — Dashboard → Requirements → Test Plan → Test Design → Test Cases → Automation → Test Execution → Test Results → RCA → Auto Heal (unlabeled, shown in SDLC order)
2. **`bottomNavItems`** — History, Settings (separated by a top border)

**Note:** Platform integration demos (Slack, Teams, Jira, VS Code) are currently commented out in the sidebar navigation but routes remain accessible.

When adding a new route, also add its title to `pageTitles` in `src/components/layout/MainLayout.tsx`.

---

## Theming & Styling

CSS variables defined in `src/index.css`, used as Tailwind classes:

| Class | Meaning |
|---|---|
| `bg-ordino-bg` | Main page background (dark) |
| `bg-ordino-card` | Card/panel background (slightly lighter) |
| `text-ordino-primary` | Orange (#f97316) — primary brand color |
| `text-ordino-secondary` | Blue (#3b82f6) — secondary accent |
| `text-ordino-success/warning/error` | Green / amber / red for status |
| `text-ordino-text` | Main body text |
| `text-ordino-text-muted` | Dimmed/secondary text |
| `border-ordino-border` | Subtle border color |

Use `cn()` from `src/utils/helpers.ts` (wraps `clsx` + `tailwind-merge`) for conditional class composition.

---

## Animations

`src/utils/animations.ts` exports shared Framer Motion variants for **page-level** use only:

- `staggerContainerVariants` + `slideUpVariants` — staggered list entry (Dashboard, History)
- `workflowStepVariants` — step circles: pending / active / completed
- `glowPulseVariants`, `spinnerVariants`, `fadeInVariants` — misc effects

Step components define their own inline variants. Platform demo components also define their own inline variants.

---

## Mock Data & Types

All fake data lives in `src/data/` as **named exports** (never default exports).

| File | Used by |
|---|---|
| `mockData.ts` | Test Scripting Demo |
| `testExecutionMockData.ts` | Test Execution Demo |
| `testFailureMockData.ts` | Test Failure Demo |
| `rcaMockData.ts` | RCA Demo |
| `autoHealMockData.ts` | Auto-Heal Demo |
| `slackMockData.ts` | Slack Integration Demo |
| `teamsMockData.ts` | Teams Integration Demo |
| `jiraMockData.ts` | Jira Integration Demo |
| `vscodeMockData.ts` | VS Code Extension Demo |

All **TypeScript types** live in `src/types/index.ts`. Add new types there — never create separate type files.

---

## Reusable UI Components

Located in `src/components/common/`. Import from the barrel: `import { Button, Badge } from '@/components/common'`.

- **Button** — variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`
- **Badge** — variants: `default`, `primary`, `secondary`, `success`, `warning`, `error`, `info`; sizes: `sm`, `md`
- **Card** — with sub-components `CardHeader`, `CardTitle`, `CardContent`
- **Modal** — props: `isOpen`, `onClose`, `title`, `size` (`sm`/`md`/`lg`)
- **Logo** — props: `size` (`sm`/`md`/`lg`), `showText`

---

## Key Libraries

| Library | Purpose |
|---|---|
| `framer-motion` | All animations and transitions |
| `lucide-react` | Icons — check exports exist before using (e.g. `Extensions` does not exist; use `Package`) |
| `recharts` | Charts on the Dashboard |
| `react-router-dom` | Client-side routing with lazy loading |
| `clsx` + `tailwind-merge` | Class composition via `cn()` |

---

## QA Domain Rules

Follows **ISTQB / IEEE 829** standards. When changing workflow steps, maintain this order:

1. **Requirements** are analyzed first
2. **Test Design** (scenarios, paths, edge conditions) is drafted from requirements
3. **Test Cases** are created from test design — never the other way around
4. **Traceability** must flow: Requirement → Test Design → Test Case

---

## UI/UX Rules

- **Approval animations**: show a green checkmark icon — do not fill entire cards with color
- **Labels**: add a subtitle when meaning could be unclear (e.g. "Testing Effort" → subtitle "without automation")
- **Blocking steps**: show an "— Awaiting Human Input" badge in the step header
- **ROI metrics cards**: shown at the top of every workflow demo — Manual Time / Ordino Time / Est. Cost Savings. Formula: `(manualMinutes / 60) * 150` ($150/hr rate)
- **Platform demo UIs**: use platform-native color schemes (Slack: purple `#19172d`, Teams: `#201f3d`, Jira: `#1a1f2e`, VS Code: `#1e1e2e`) — do not use ordino-card/ordino-bg inside platform mockups
