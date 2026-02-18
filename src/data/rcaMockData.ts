import type {
  FailingBuild,
  RCAAnalysisStep,
  SlackMessage,
  HumanResponse,
  RCAReport,
  RCAStakeholderNotification,
  RCATimeMetric,
  FiveWhysEntry,
} from '../types';

export const failingBuilds: FailingBuild[] = [
  {
    buildNumber: 47,
    commitHash: 'e3a1b90',
    failedTest: 'TC-042',
    errorMessage: 'AssertionError: Expected token expiry 3600s, got 300s',
    timestamp: '2024-01-14 09:12:33',
  },
  {
    buildNumber: 48,
    commitHash: 'c5d2f11',
    failedTest: 'TC-042',
    errorMessage: 'AssertionError: Expected token expiry 3600s, got 300s',
    timestamp: '2024-01-14 11:47:08',
  },
  {
    buildNumber: 49,
    commitHash: 'b7e4a23',
    failedTest: 'TC-042',
    errorMessage: 'AssertionError: Expected token expiry 3600s, got 300s',
    timestamp: '2024-01-14 14:21:55',
  },
];

export const rcaAnalysisSteps: RCAAnalysisStep[] = [
  {
    id: 'stack-trace',
    label: 'Stack Trace Analysis',
    finding: 'JWT token expiry mismatch (300s vs 3600s)',
    type: 'error',
  },
  {
    id: 'code-change',
    label: 'Code Change Impact',
    finding: 'Commit f8a2c91 modified JWT_EXPIRY on 2024-01-12',
    type: 'error',
  },
  {
    id: 'env-checks',
    label: 'Environment Checks',
    finding: 'Staging JWT config differs from test expectations',
    type: 'info',
  },
  {
    id: 'test-suite-scan',
    label: 'Test Suite Scan',
    finding: '3 additional tests with hardcoded JWT_EXPIRY: TC-089, TC-112, TC-203',
    type: 'warning',
  },
  {
    id: 'log-correlation',
    label: 'Log Correlation',
    finding: 'Error consistent across 3 builds, same assertion point',
    type: 'info',
  },
];

export const slackMessages: SlackMessage[] = [
  {
    id: 'msg-1',
    channel: '#qa-engineers',
    recipient: '#qa-engineers',
    message:
      'TC-042 "User Authentication Timeout" has failed in 3 consecutive builds (#47, #48, #49). Root cause identified: JWT_EXPIRY config change in commit f8a2c91. Initiating human collaboration to confirm intent.',
  },
  {
    id: 'msg-2',
    channel: 'Direct Message',
    recipient: '@sarah.chen',
    message:
      'Hi Sarah, Ordino has detected a pattern failure in TC-042. The JWT_EXPIRY was reduced from 3600s to 300s in commit f8a2c91 by Alex Kim. Was this change intentional? Does TC-042 need to be updated to reflect the new expiry?',
  },
  {
    id: 'msg-3',
    channel: 'Direct Message',
    recipient: '@dev-backend',
    message:
      'Hi Alex, Ordino is investigating build failures in TC-042. Commit f8a2c91 changed JWT_EXPIRY from 3600s → 300s. Can you confirm whether this is a permanent config change that requires test updates?',
  },
  {
    id: 'msg-4',
    channel: 'Direct Message',
    recipient: '@david.park',
    message:
      'Hi David, escalating for Tech Lead awareness — Ordino has identified commit f8a2c91 as root cause of 3 consecutive failures in TC-042 (High severity auth failure). Sarah Chen and Alex Kim have been contacted. Your sign-off on proceeding with test assertion updates is requested.',
  },
];

export const humanResponses: HumanResponse[] = [
  {
    id: 'resp-1',
    from: 'Sarah Chen',
    role: 'QA Lead',
    message:
      "Yes, the JWT_EXPIRY change was intentional — it was a security hardening decision. TC-042 needs to be updated to assert 300s instead of 3600s. Please update the test and add a comment explaining the change.",
    timestamp: '2024-01-14 15:03:21',
  },
  {
    id: 'resp-2',
    from: 'Alex Kim',
    role: 'Backend Engineer',
    message:
      "Confirmed. The JWT_EXPIRY reduction to 300s was a deliberate security improvement per ticket SEC-089. All authentication tests that assert token expiry values need to be updated.",
    timestamp: '2024-01-14 15:11:47',
  },
  {
    id: 'resp-3',
    from: 'David Park',
    role: 'Tech Lead',
    message:
      "Approved to update TC-042. Also check if any other tests reference JWT_EXPIRY — there may be additional tests requiring the same fix.",
    timestamp: '2024-01-14 15:18:05',
  },
];

export const rcaReport: RCAReport = {
  id: 'RCA-2024-0114',
  title: 'TC-042 User Authentication Timeout — Consecutive Build Failures',
  severity: 'High',
  problemStatement:
    'TC-042 "User Authentication Timeout" failed in 3 consecutive CI builds (#47, #48, #49) due to a JWT configuration change that was not reflected in the test assertions.',
  timeline: [
    { date: '2024-01-12 16:30', event: 'Commit f8a2c91 by Alex Kim reduces JWT_EXPIRY from 3600s to 300s' },
    { date: '2024-01-14 09:12', event: 'Build #47 fails — TC-042 first failure detected' },
    { date: '2024-01-14 11:47', event: 'Build #48 fails — pattern confirmed' },
    { date: '2024-01-14 14:21', event: 'Build #49 fails — Ordino initiates RCA' },
    { date: '2024-01-14 15:18', event: 'Human collaboration confirms intentional change' },
  ],
  rootCause: {
    title: 'JWT_EXPIRY configuration reduced without test update',
    detail:
      'Commit f8a2c91 (Alex Kim, 2024-01-12) reduced JWT_EXPIRY from 3600s to 300s for security hardening per SEC-089. TC-042 continued to assert the old 3600s value, causing assertion failures.',
  },
  contributingFactors: [
    'No automated check to detect config-to-test assertion drift',
    'JWT_EXPIRY change not flagged as requiring test maintenance',
    'Missing notification to QA team when auth config changes',
  ],
  resolutionSteps: [
    { id: 1, action: 'Update TC-042 assertion from 3600s to 300s', owner: 'Ordino AI', priority: 'High' },
    { id: 2, action: 'Scan all tests referencing JWT_EXPIRY for similar mismatches', owner: 'Ordino AI', priority: 'High' },
    { id: 3, action: 'Add config-change webhook to trigger test review', owner: 'DevOps', priority: 'Medium' },
    { id: 4, action: 'Create test maintenance checklist for security config changes', owner: 'QA Lead', priority: 'Low' },
  ],
  preventionRecommendations: [
    'Implement automated config-drift detection between environment configs and test assertions',
    'Require QA sign-off on commits that modify authentication configuration values',
    'Add Ordino alert rules for 2+ consecutive failures on the same test case',
  ],
  fiveWhys: [
    { why: 'Why did TC-042 fail?', answer: 'It asserted token expiry of 3600s but the system returned 300s.' },
    { why: 'Why did the system return 300s?', answer: 'JWT_EXPIRY was changed to 300s in commit f8a2c91.' },
    { why: 'Why was JWT_EXPIRY changed?', answer: 'Deliberate security hardening per ticket SEC-089.' },
    { why: 'Why did the test not account for this?', answer: 'TC-042 hardcodes the assertion value instead of reading from config.' },
    { why: 'Why does TC-042 hardcode the value?', answer: 'No test authoring standard requires config-driven assertions for environment-sensitive values.' },
  ] satisfies FiveWhysEntry[],
};

export const rcaStakeholderNotifications: RCAStakeholderNotification[] = [
  {
    id: 1,
    channel: 'Slack',
    icon: 'MessageSquare',
    recipient: '#qa-engineers',
    message: 'RCA-2024-0114 complete: TC-042 fixed. Root cause was JWT_EXPIRY config drift. Test updated.',
    color: 'bg-pink-500',
  },
  {
    id: 2,
    channel: 'Email',
    icon: 'Mail',
    recipient: 'qa-team@company.com',
    message: 'RCA Report RCA-2024-0114 attached: User Authentication Timeout — 3 build failures resolved.',
    color: 'bg-blue-500',
  },
  {
    id: 3,
    channel: 'Jira',
    icon: 'ExternalLink',
    recipient: 'ORD-2024-RCA',
    message: 'Jira ticket created with full RCA report, resolution steps, and prevention recommendations.',
    color: 'bg-indigo-500',
  },
  {
    id: 4,
    channel: 'Slack',
    icon: 'MessageSquare',
    recipient: '@alex.kim',
    message: 'Hi Alex — TC-042 has been updated to reflect the new JWT_EXPIRY=300s. Build #50 should now pass.',
    color: 'bg-pink-500',
  },
  {
    id: 5,
    channel: 'Slack',
    icon: 'MessageSquare',
    recipient: '#security-qa',
    message: 'FYI: RCA-2024-0114 — JWT_EXPIRY security hardening (SEC-089) caused TC-042 test failure in 3 consecutive builds. Test has been flagged for update. No security regression identified.',
    color: 'bg-purple-500',
  },
];

// Time/Cost Metrics for RCA Demo (manual minutes vs ordino seconds)
export const rcaTimeMetrics: RCATimeMetric[] = [
  { manual: 0, ordino: 0 },    // Step 0 (Start)
  { manual: 20, ordino: 4 },   // Build Pipeline Trigger
  { manual: 40, ordino: 5 },   // Failure Pattern Detection
  { manual: 60, ordino: 7 },   // Automated RCA Analysis
  { manual: 30, ordino: 4 },   // Root Cause Identified
  { manual: 60, ordino: 4 },   // Human Collaboration Request
  { manual: 30, ordino: 6 },   // RCA Completion
  { manual: 20, ordino: 5 },   // Report & Notification
];
