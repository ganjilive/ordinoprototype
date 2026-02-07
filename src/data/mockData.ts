import type { Metric, Activity, ConnectedTool, TrendDataPoint, HistoryEntry, TraceabilityNode } from '../types';

// Dashboard Metrics
export const metrics: Metric[] = [
  {
    id: '1',
    label: 'Test Coverage',
    value: 87.3,
    unit: '%',
    trend: 'up',
    trendValue: 2.1,
    icon: 'Target',
  },
  {
    id: '2',
    label: 'Pass Rate',
    value: 98.7,
    unit: '%',
    trend: 'up',
    trendValue: 0.5,
    icon: 'CheckCircle',
  },
  {
    id: '3',
    label: 'Automation',
    value: 76.2,
    unit: '%',
    trend: 'up',
    trendValue: 5.3,
    icon: 'Zap',
  },
  {
    id: '4',
    label: 'Open Bugs',
    value: 12,
    unit: '',
    trend: 'down',
    trendValue: 3,
    icon: 'Bug',
  },
];

// Recent Activities
export const activities: Activity[] = [
  {
    id: '1',
    action: 'Generated 8 test cases for',
    target: 'ORD-1234: Add two-factor authentication',
    tool: 'testrail',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    status: 'success',
  },
  {
    id: '2',
    action: 'Analyzed requirement',
    target: 'ORD-1233: User profile enhancements',
    tool: 'jira',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'success',
  },
  {
    id: '3',
    action: 'Synced 156 test results to',
    target: 'main branch',
    tool: 'github',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: 'success',
  },
  {
    id: '4',
    action: 'Sent gap analysis report to',
    target: 'QA Team Channel',
    tool: 'slack',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'success',
  },
  {
    id: '5',
    action: 'Detected UI changes in',
    target: 'Login Screen Mockup',
    tool: 'figma',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'pending',
  },
];

// Connected Tools
export const connectedTools: ConnectedTool[] = [
  {
    id: '1',
    name: 'Jira',
    icon: 'jira',
    status: 'connected',
    lastSync: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    name: 'GitHub',
    icon: 'github',
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Figma',
    icon: 'figma',
    status: 'syncing',
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '4',
    name: 'TestRail',
    icon: 'testrail',
    status: 'connected',
    lastSync: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '5',
    name: 'Slack',
    icon: 'slack',
    status: 'connected',
    lastSync: new Date(Date.now() - 1 * 60 * 1000),
  },
];

// Trend Data for Charts
export const trendData: TrendDataPoint[] = [
  { date: 'Jan 1', coverage: 72, passRate: 94, automation: 58 },
  { date: 'Jan 8', coverage: 74, passRate: 95, automation: 60 },
  { date: 'Jan 15', coverage: 75, passRate: 94, automation: 62 },
  { date: 'Jan 22', coverage: 78, passRate: 96, automation: 65 },
  { date: 'Jan 29', coverage: 80, passRate: 97, automation: 68 },
  { date: 'Feb 5', coverage: 82, passRate: 96, automation: 70 },
  { date: 'Feb 12', coverage: 83, passRate: 97, automation: 72 },
  { date: 'Feb 19', coverage: 85, passRate: 98, automation: 74 },
  { date: 'Feb 26', coverage: 86, passRate: 98, automation: 75 },
  { date: 'Mar 5', coverage: 87.3, passRate: 98.7, automation: 76.2 },
];

// History Entries
export const historyEntries: HistoryEntry[] = [
  {
    id: '1',
    action: 'Test Case Generation',
    category: 'test-generation',
    status: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    details: {
      requirement: 'ORD-1234: Add two-factor authentication',
      testCases: [
        'TC-001: Verify 2FA setup flow for new users',
        'TC-002: Verify 2FA code validation (valid code)',
        'TC-003: Verify 2FA code validation (invalid code)',
        'TC-004: Verify 2FA recovery flow',
        'TC-005: Verify 2FA timeout handling',
        'TC-006: Verify 2FA disable flow',
        'TC-007: Verify 2FA backup codes generation',
        'TC-008: Verify 2FA backup code usage',
      ],
    },
  },
  {
    id: '2',
    action: 'Gap Analysis',
    category: 'gap-analysis',
    status: 'success',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    details: {
      requirement: 'ORD-1233: User profile enhancements',
      gaps: [
        'Missing edge case tests for profile image upload size limits',
        'No tests for concurrent profile edit scenarios',
        'Performance tests needed for bulk profile updates',
      ],
    },
  },
  {
    id: '3',
    action: 'Stakeholder Notification',
    category: 'notification',
    status: 'success',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    details: {
      recipients: ['QA Team', 'Product Manager', 'Tech Lead'],
    },
  },
  {
    id: '4',
    action: 'Test Results Sync',
    category: 'sync',
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    details: {},
  },
];

// Traceability Tree
export const traceabilityTree: TraceabilityNode[] = [
  {
    id: 'req-1',
    type: 'requirement',
    title: 'ORD-1234: Add two-factor authentication',
    status: 'passed',
    children: [
      {
        id: 'tp-1',
        type: 'test-plan',
        title: 'TP-100: 2FA Test Plan',
        status: 'passed',
        children: [
          { id: 'tc-1', type: 'test-case', title: 'TC-001: Verify 2FA setup flow', status: 'passed' },
          { id: 'tc-2', type: 'test-case', title: 'TC-002: Verify valid code', status: 'passed' },
          { id: 'tc-3', type: 'test-case', title: 'TC-003: Verify invalid code', status: 'passed' },
          { id: 'tc-4', type: 'test-case', title: 'TC-004: Verify recovery flow', status: 'failed' },
        ],
      },
    ],
  },
  {
    id: 'req-2',
    type: 'requirement',
    title: 'ORD-1233: User profile enhancements',
    status: 'pending',
    children: [
      {
        id: 'tp-2',
        type: 'test-plan',
        title: 'TP-101: Profile Enhancement Test Plan',
        status: 'pending',
        children: [
          { id: 'tc-5', type: 'test-case', title: 'TC-005: Verify avatar upload', status: 'not-run' },
          { id: 'tc-6', type: 'test-case', title: 'TC-006: Verify bio update', status: 'not-run' },
        ],
      },
    ],
  },
];

// Workflow Demo Data
export const workflowSteps = [
  {
    id: 1,
    title: 'Requirement Detected',
    description: 'New Jira ticket ORD-1234 detected in the backlog',
    visual: 'jira-ticket',
  },
  {
    id: 2,
    title: 'Analyzing Requirement',
    description: 'Ordino AI is analyzing the requirement for testability and coverage gaps',
    visual: 'ai-analysis',
  },
  {
    id: 3,
    title: 'Gaps Identified',
    description: '3 coverage gaps identified in the current test suite',
    visual: 'gap-analysis',
  },
  {
    id: 4,
    title: 'Generating Test Plan',
    description: 'Creating comprehensive test cases based on requirement analysis',
    visual: 'test-generation',
  },
  {
    id: 5,
    title: 'Awaiting Approval',
    description: 'Test plan ready for review and approval',
    visual: 'approval',
  },
  {
    id: 6,
    title: 'Applying Updates',
    description: 'Syncing approved test cases to TestRail and GitHub',
    visual: 'sync',
  },
  {
    id: 7,
    title: 'Notifying Stakeholders',
    description: 'Sending notifications to QA team and stakeholders',
    visual: 'notification',
  },
];

// Sample Jira Requirement for Demo
export const sampleRequirement = {
  key: 'ORD-1234',
  title: 'Add two-factor authentication to login flow',
  description: `As a user, I want to enable two-factor authentication for my account so that my data is more secure.

**Acceptance Criteria:**
- Users can enable 2FA from account settings
- Support for authenticator apps (Google Authenticator, Authy)
- Backup codes provided during setup
- 2FA can be disabled with password verification
- Grace period for first-time setup`,
  priority: 'High',
  status: 'Approved',
  assignee: 'John Smith',
  reporter: 'Sarah Johnson',
  created: new Date('2024-01-15'),
  labels: ['security', 'authentication', 'user-requested'],
};

// Generated Test Cases for Demo
export const generatedTestCases = [
  {
    id: 'TC-001',
    title: 'Verify 2FA setup flow for new users',
    priority: 'High',
    type: 'Functional',
  },
  {
    id: 'TC-002',
    title: 'Verify 2FA code validation (valid code)',
    priority: 'High',
    type: 'Functional',
  },
  {
    id: 'TC-003',
    title: 'Verify 2FA code validation (invalid code)',
    priority: 'High',
    type: 'Negative',
  },
  {
    id: 'TC-004',
    title: 'Verify 2FA recovery flow with backup codes',
    priority: 'Medium',
    type: 'Functional',
  },
  {
    id: 'TC-005',
    title: 'Verify 2FA timeout after 30 seconds',
    priority: 'Medium',
    type: 'Edge Case',
  },
  {
    id: 'TC-006',
    title: 'Verify 2FA disable with password verification',
    priority: 'Medium',
    type: 'Functional',
  },
  {
    id: 'TC-007',
    title: 'Verify backup codes generation (10 codes)',
    priority: 'Low',
    type: 'Functional',
  },
  {
    id: 'TC-008',
    title: 'Verify single-use backup code consumption',
    priority: 'Low',
    type: 'Functional',
  },
];
