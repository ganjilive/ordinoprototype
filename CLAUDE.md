# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ordino is a QA workflow automation prototype that demonstrates an AI-powered test design and automation workflow. It's a React + TypeScript + Vite application showcasing a 12-step QA process from requirement detection through test artifact creation and stakeholder notification.

## Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint check
npm run preview  # Preview production build locally
```

## Architecture

### Application Structure

The app uses React Router with lazy-loaded pages wrapped in a `MainLayout`:
- `/` - Dashboard with metrics, charts, activity feed
- `/demo` - Test Scripting Demo: Interactive 12-step QA workflow for test design and automation
- `/execution` - Test Execution Demo: Placeholder for future test execution workflow
- `/history` - Historical records and traceability
- `/settings` - Integration and project configuration

### Test Scripting Demo (Core Feature)

The Test Scripting Demo (`/demo`) is the main feature, managed by:
- `useWorkflowDemo.ts` hook - State machine controlling the 12-step workflow progression, approval tracking, blockers, and revisions
- `WorkflowDemo.tsx` - Main component orchestrating step rendering and controls
- `WorkflowTimeline.tsx` - Visual timeline showing step progress

**12 Workflow Steps:**
1. Requirement Detected (JiraRequirement)
2. Analyzing Requirement + Triage (OrdinoThinking - merged analysis and triage)
3. Triage Approval (TriageApproval)
4. Find Test Artifacts (TestArtifactLookup - discovery + gap analysis only)
5. Draft Test Design (TestDesignDrafting - design first, then test cases, then coverage)
6. Review (TestDesignReview - combined peer + lead review)
7. Create Test Artifacts (TestArtifactCreation - creates plan, design, and cases)
8. Draft Test Data Plan (TestDataStrategy)
9. Draft Automation Scripts (AutomationScriptDrafting)
10. Review Automation Scripts (AutomationScriptApproval)
11. Create Automation Scripts (AutomationScriptCreation)
12. Notify Stakeholders (NotificationToast)

Approval steps (3, 6, 10) block workflow progression until approved.

### Step Components Pattern

Each workflow step in `src/components/workflow/steps/` follows a multi-phase pattern:
- Uses `useState` for `currentPhase` and `completedPhases`
- Auto-advances through phases using `useEffect` with intervals
- Renders phases conditionally based on completion state
- Shows progress indicator at top

### Key Step Components

- **OrdinoThinking.tsx** - Step 2: Displays AI analysis animation and triage assessment results including completeness score, testability level, testing effort (labeled "without automation" to clarify manual effort), identified gaps, and risk flags
- **TriageApproval.tsx** - Step 3: Multi-level approval chain with animated timeline showing reviewer progress; approved reviewers show green border with checkmark icon
- **TestDesignDrafting.tsx** - Step 5: Drafts test design scenarios, test cases, and coverage matrix
- **AutomationScriptDrafting.tsx** - Step 9: Generates automation scripts with feasibility analysis

### Theming

Custom Tailwind theme defined in `src/index.css` using CSS variables:
- `ordino-bg`, `ordino-card` - Background colors (dark theme)
- `ordino-primary` (#f97316 orange), `ordino-secondary` (#3b82f6 blue)
- `ordino-success`, `ordino-warning`, `ordino-error` - Status colors
- `ordino-text`, `ordino-text-muted`, `ordino-border`

### Key Libraries

- **framer-motion** - All animations and transitions
- **lucide-react** - Icon library
- **recharts** - Dashboard charts
- **react-router-dom** - Routing with lazy loading

### Data Layer

All demo data is in `src/data/mockData.ts`. Types are in `src/types/index.ts`. The workflow uses mock data for:
- Test plans, test designs, test cases
- Triage analysis results
- Automation feasibility assessments
- Traceability matrices and coverage analysis
- Blockers and approval chains

## QA Domain Context

This prototype demonstrates ISTQB/IEEE 829 compliant QA processes. When modifying workflow steps, maintain proper QA terminology and process ordering:
- Test design (scenarios, paths, conditions) should be drafted BEFORE test cases
- Test cases flow from test design, not vice versa
- Traceability links requirements to test designs to test cases

## UI/UX Guidelines

- Approval animations should show state changes clearly (e.g., green checkmark icon) without overwhelming visual changes (avoid filling entire elements with color)
- Labels should be clear and unambiguous; add subtitles when clarification is needed (e.g., "Testing Effort" has subtitle "without automation")
- Use consistent spacing and follow existing component patterns
