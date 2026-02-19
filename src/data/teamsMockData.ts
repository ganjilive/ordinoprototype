import type { TeamsReportData, TeamsChannelMessage } from '../types';

export const teamsReportData: TeamsReportData = {
  sprintName: 'Sprint 23 Regression',
  passed: 142,
  failed: 8,
  skipped: 4,
  duration: '12m 34s',
  coverage: 78.4,
  passRate: 93.4,
  topFailures: [
    { name: 'PaymentGatewayTest', severity: 'Critical', isBlocking: true },
    { name: 'UserRolePermissionsTest', severity: 'High', isBlocking: true },
    { name: 'SessionTimeoutTest', severity: 'Medium', isBlocking: false },
    { name: 'NotificationEmailTest', severity: 'Low', isBlocking: false },
  ],
};

export const teamsInitialMessages: TeamsChannelMessage[] = [
  {
    id: 'msg-1',
    authorName: 'Ordino Bot',
    authorType: 'bot',
    content: '',
    timestamp: '2:15 PM',
    isReport: true,
  },
  {
    id: 'msg-2',
    authorName: 'Ordino Bot',
    authorType: 'bot',
    content:
      'Sprint 23 regression run complete. 154 tests executed — 142 passed, 8 failed, 4 skipped. 8 failures require attention before deployment.',
    timestamp: '2:15 PM',
  },
  {
    id: 'msg-3',
    authorName: 'Alex Chen',
    authorType: 'human',
    content: 'Thanks @Ordino — can you flag which failures are blocking?',
    timestamp: '2:17 PM',
  },
  {
    id: 'msg-4',
    authorName: 'Ordino Bot',
    authorType: 'bot',
    content:
      '**Blocking failures (2):**\n• **PaymentGatewayTest** (Critical) — payment flow broken, deploy blocker\n• **UserRolePermissionsTest** (High) — auth bypass risk, deploy blocker\n\nThe remaining 6 failures are non-blocking flakiness (timing/network) and can be addressed post-deploy.',
    timestamp: '2:17 PM',
  },
];

export const teamsKeywordResponses: Record<string, string> = {
  'coverage|sprint coverage|test coverage':
    '**Coverage: 78.4%** for Sprint 23\nUp from 76.1% last sprint (+2.3%). Branch coverage is at 71.2%, statement coverage at 82.6%. The payment module has the lowest coverage at 61% — that\'s where PaymentGatewayTest lives.',

  'pass rate|passing|passed':
    '**Pass Rate: 93.4%** — 142 out of 154 tests passed.\nBreakdown: 142 passed ✓ | 8 failed ✗ | 4 skipped ⊘\nThis is up from 89.2% last sprint. The improvement is from fixing the 6 flaky network tests identified in Sprint 22.',

  'deploy|deployment|ready|ship|release':
    "**Not ready to deploy.** 2 blocking failures must be resolved first:\n1. **PaymentGatewayTest** — broken payment flow (Critical)\n2. **UserRolePermissionsTest** — auth bypass vulnerability (High)\n\nOnce these are fixed and tests pass, deployment can proceed. Non-blocking failures can be tracked as tech debt.",

  'regression|failures|failed tests':
    '**8 failures in Sprint 23 regression:**\n\n*Blocking (2):*\n• PaymentGatewayTest — Critical\n• UserRolePermissionsTest — High\n\n*Non-blocking flakiness (6):*\n• SessionTimeoutTest — timing sensitivity\n• NotificationEmailTest — SMTP mock timeout\n• 4 others — intermittent network failures\n\nFlaky tests will be stabilized in Sprint 24.',

  'blocking|blockers|critical':
    '**2 blocking failures:**\n\n**1. PaymentGatewayTest** (Critical)\n— Stripe API mock returning 402 on valid test cards\n— Affects checkout flow end-to-end\n— Linked to Jira: PAY-234\n\n**2. UserRolePermissionsTest** (High)\n— Admin role can access user-restricted endpoints\n— Security regression from the RBAC refactor\n— Linked to Jira: AUTH-891',

  'trend|history|previous sprint|last sprint':
    '**3-Sprint Coverage Trend:**\n• Sprint 21: 73.4% | Pass Rate: 87.1%\n• Sprint 22: 76.1% | Pass Rate: 89.2%\n• Sprint 23: 78.4% | Pass Rate: 93.4%\n\nConsistent improvement each sprint. Automation coverage growing at ~+2.5% per sprint. On track to hit 85% coverage target by Sprint 26.',
};

export const teamsSuggestedPrompts = [
  'What is the pass rate?',
  'Are we ready to deploy?',
  'Which failures are blocking?',
  'Show coverage trend',
];
