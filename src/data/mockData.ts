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

// ROI / Efficiency Metrics
export const roiMetrics = {
  hoursSaved: 1240,
  costSaved: 186000,
  efficiencyGain: 85,
  testCreationSpeedup: '12x',
};

// Efficiency Comparison Data (Manual vs Ordino)
export const efficiencyComparison = [
  { task: 'Test Case Creation', manual: 120, ordino: 10, unit: 'min' },
  { task: 'Test Maintenance', manual: 60, ordino: 5, unit: 'min' },
  { task: 'Defect Reporting', manual: 30, ordino: 2, unit: 'min' },
  { task: 'RCA & Triage', manual: 240, ordino: 15, unit: 'min' },
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
  description: `We need to add two-factor authentication for better security.

Users should be able to set it up somehow.`,
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

// Test Plan Data
export const testPlan = {
  productName: 'Authentication System',
  version: '2.1',
  automationPercentageTarget: 75,
  integrationTestRequired: true,
  integrationTestDescription: 'All API endpoints must have integration tests',
  databaseVerificationRequired: true,
  databaseVerificationDescription: 'Verify user authentication state in database',
  // Test Plan Structure (IEEE 829 / ISTQB compliant)
  testObjectives: [
    'Verify 2FA functionality meets security requirements',
    'Ensure authentication flows work correctly across all supported platforms',
    'Validate error handling and edge cases in authentication process',
    'Confirm backup code recovery mechanism functions properly',
  ],
  testScope: {
    inScope: [
      '2FA setup and configuration',
      '2FA code validation during login',
      'Backup code generation and usage',
      '2FA timeout handling',
      '2FA disable functionality',
      'Error handling for invalid codes',
    ],
    outOfScope: [
      'Third-party authenticator app functionality (Google Authenticator, Authy)',
      'Network infrastructure testing',
      'Performance and load testing (covered in separate test plan)',
      'Security penetration testing (covered by security team)',
    ],
  },
  testItems: [
    'User Authentication Module',
    '2FA Configuration Module',
    'Backup Code Management Module',
    'Login Flow with 2FA',
  ],
  testApproach: 'Risk-based testing approach focusing on security-critical authentication flows. Priority given to high-risk scenarios involving user authentication and data security.',
  passFailCriteria: {
    passCriteria: [
      'All critical test cases pass',
      'No high-severity defects remain open',
      'Test coverage >= 80% for requirements',
      'All security-related test cases pass',
    ],
    failCriteria: [
      'Any critical test case fails',
      'High-severity security defect found',
      'Test coverage < 80%',
      'Authentication bypass vulnerability discovered',
    ],
  },
  suspensionCriteria: [
    'Test environment unavailable for more than 24 hours',
    'Critical blocker defect prevents test execution',
    'Requirement changes occur during testing phase',
    'Test data corruption or unavailability',
  ],
  resumptionCriteria: [
    'Test environment restored and verified',
    'Blocker defect resolved and verified',
    'Requirements finalized and test plan updated',
    'Test data restored and validated',
  ],
  testDeliverables: [
    'Test Plan Document',
    'Test Design Specification',
    'Test Cases (manual and automated)',
    'Test Execution Results',
    'Defect Reports',
    'Test Summary Report',
    'Test Automation Scripts',
  ],
  testEnvironment: {
    hardware: ['Windows 10/11 test machines', 'macOS test machines', 'Linux test machines', 'iOS devices', 'Android devices'],
    software: ['Chrome browser (latest)', 'Firefox browser (latest)', 'Safari browser (latest)', 'Mobile browsers'],
    network: ['Internal test network', 'VPN access for remote testing'],
    tools: ['Selenium WebDriver', 'REST Assured', 'TestRail', 'Jira', 'GitHub'],
  },
  testSchedule: {
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-02-28'),
    milestones: [
      { name: 'Test Design Complete', date: new Date('2024-02-20') },
      { name: 'Test Execution Start', date: new Date('2024-02-22') },
      { name: 'Test Execution Complete', date: new Date('2024-02-27') },
    ],
  },
  risks: [
    {
      risk: 'Test environment availability',
      impact: 'High',
      mitigation: 'Maintain backup test environment and coordinate with DevOps team',
    },
    {
      risk: 'UI design changes during development',
      impact: 'Medium',
      mitigation: 'Use stable locators, coordinate with UX team, implement locator strategy',
    },
    {
      risk: 'Insufficient test data',
      impact: 'Medium',
      mitigation: 'Create comprehensive test data management strategy and automated setup',
    },
    {
      risk: 'Third-party authenticator app compatibility',
      impact: 'Low',
      mitigation: 'Test with multiple authenticator apps and document compatibility',
    },
  ],
  workflows: [
    {
      id: 'WF-001',
      name: 'User Authentication Flow',
      description: 'Complete user login and authentication process',
      priority: 'High',
    },
    {
      id: 'WF-002',
      name: 'Two-Factor Authentication Setup',
      description: 'User enables and configures 2FA',
      priority: 'High',
    },
    {
      id: 'WF-003',
      name: 'Account Recovery Flow',
      description: 'User recovers account using backup codes',
      priority: 'Medium',
    },
  ],
  highLevelScenarios: [
    {
      id: 'SC-001',
      name: '2FA Setup Scenario',
      description: 'User successfully sets up 2FA with authenticator app',
      relatedWorkflow: 'WF-002',
    },
    {
      id: 'SC-002',
      name: '2FA Login Scenario',
      description: 'User logs in with 2FA code',
      relatedWorkflow: 'WF-001',
    },
    {
      id: 'SC-003',
      name: 'Backup Code Recovery Scenario',
      description: 'User recovers account using backup codes',
      relatedWorkflow: 'WF-003',
    },
  ],
};

// Test Design Data
export const testDesign = {
  id: 'TD-100',
  name: 'Authentication Test Design',
  connectedTestPlan: 'TP-100',
  version: '1.3',
  paths: [
    {
      id: 'PATH-001',
      name: '2FA Setup Path',
      description: 'Complete path for setting up 2FA',
      scenarios: ['SC-001', 'SC-002'],
      status: 'affected',
      affectedReason: 'New requirement adds 2FA timeout scenarios',
    },
    {
      id: 'PATH-002',
      name: 'Login Flow Path',
      description: 'Standard login authentication path',
      scenarios: ['SC-002'],
      status: 'affected',
      affectedReason: 'Requires 2FA code validation step',
    },
    {
      id: 'PATH-003',
      name: 'Recovery Path',
      description: 'Account recovery using backup codes',
      scenarios: ['SC-003'],
      status: 'not-affected',
    },
  ],
};

// Existing Test Cases
export const existingTestCases = [
  {
    id: 'TC-EXIST-001',
    title: 'Verify standard login flow',
    description: 'User logs in with username and password',
    connectedPathId: 'PATH-002',
    testingMethod: 'automation',
    status: 'active',
    coverage: 'Login Flow Path',
  },
  {
    id: 'TC-EXIST-002',
    title: 'Verify password reset flow',
    description: 'User resets password via email',
    connectedPathId: 'PATH-003',
    testingMethod: 'manual',
    status: 'active',
    coverage: 'Recovery Path',
  },
];

// Drafted Test Cases (ISTQB / IEEE 829 compliant structure)
export const draftedTestCases = [
  {
    id: 'TC-DRAFT-001',
    title: 'Verify 2FA setup flow for new users',
    description: 'User enables 2FA from account settings and scans QR code',
    testObjective: 'Verify that users can successfully set up 2FA using authenticator app',
    preconditions: [
      'User is logged into the application',
      'User has access to Account Settings',
      'User has an authenticator app installed on their mobile device',
      'User has not previously enabled 2FA',
    ],
    testSteps: [
      {
        stepNumber: 1,
        action: 'Navigate to Account Settings > Security',
        expectedResult: 'Security settings page displays with 2FA option visible',
      },
      {
        stepNumber: 2,
        action: 'Click on "Enable Two-Factor Authentication" button',
        expectedResult: '2FA setup wizard appears with QR code displayed',
      },
      {
        stepNumber: 3,
        action: 'Scan QR code using authenticator app',
        expectedResult: 'Authenticator app successfully adds the account and displays 6-digit code',
      },
      {
        stepNumber: 4,
        action: 'Enter the 6-digit code from authenticator app',
        expectedResult: 'Code is accepted and 2FA is successfully enabled',
      },
      {
        stepNumber: 5,
        action: 'Verify backup codes are displayed and saved',
        expectedResult: 'Backup codes are shown and can be downloaded/saved',
      },
    ],
    postconditions: [
      '2FA is enabled for the user account',
      'User is logged out and must use 2FA for next login',
      'Backup codes are generated and stored',
    ],
    testData: {
      required: [
        'Valid user account credentials',
        'Test user account with standard permissions',
        'Mobile device with authenticator app',
      ],
      setup: 'Create test user account with standard permissions',
    },
    testingMethod: 'automation',
    categorizationReason: 'High frequency scenario, suitable for automation',
    priority: 'High',
    requirementId: 'ORD-1234',
  },
  {
    id: 'TC-DRAFT-002',
    title: 'Verify 2FA code validation (valid code)',
    description: 'User enters valid 2FA code and successfully authenticates',
    testObjective: 'Verify that valid 2FA codes are correctly validated during login',
    preconditions: [
      'User has 2FA enabled on their account',
      'User is on the login page',
      'User has entered valid username and password',
      'User has access to authenticator app with valid code',
    ],
    testSteps: [
      {
        stepNumber: 1,
        action: 'Enter username and password, click Login',
        expectedResult: 'Login form validates credentials and prompts for 2FA code',
      },
      {
        stepNumber: 2,
        action: 'Retrieve current 6-digit code from authenticator app',
        expectedResult: 'Authenticator app displays valid 6-digit code',
      },
      {
        stepNumber: 3,
        action: 'Enter the 6-digit code in the 2FA input field',
        expectedResult: 'Code is accepted and user is successfully authenticated',
      },
      {
        stepNumber: 4,
        action: 'Verify user is redirected to dashboard',
        expectedResult: 'User dashboard loads successfully',
      },
    ],
    postconditions: [
      'User is logged into the application',
      'Session is established with 2FA authentication',
      'User can access protected resources',
    ],
    testData: {
      required: [
        'User account with 2FA enabled',
        'Valid username and password',
        'Authenticator app with synchronized time',
      ],
      setup: 'Create user account, enable 2FA, ensure authenticator app is synchronized',
    },
    testingMethod: 'automation',
    categorizationReason: 'Core functionality, needs automated regression testing',
    priority: 'High',
    requirementId: 'ORD-1234',
  },
  {
    id: 'TC-DRAFT-003',
    title: 'Verify 2FA code validation (invalid code)',
    description: 'User enters invalid 2FA code and receives error',
    testObjective: 'Verify that invalid 2FA codes are rejected with appropriate error message',
    preconditions: [
      'User has 2FA enabled on their account',
      'User is on the login page',
      'User has entered valid username and password',
    ],
    testSteps: [
      {
        stepNumber: 1,
        action: 'Enter username and password, click Login',
        expectedResult: 'Login form validates credentials and prompts for 2FA code',
      },
      {
        stepNumber: 2,
        action: 'Enter an invalid 6-digit code (e.g., 000000)',
        expectedResult: 'Error message displays: "Invalid code. Please try again."',
      },
      {
        stepNumber: 3,
        action: 'Verify user remains on login page',
        expectedResult: 'User is not authenticated and remains on 2FA code entry screen',
      },
      {
        stepNumber: 4,
        action: 'Verify failed attempt is logged',
        expectedResult: 'Failed authentication attempt is recorded in security logs',
      },
    ],
    postconditions: [
      'User is not logged in',
      'Failed attempt is logged',
      'User can retry with correct code',
    ],
    testData: {
      required: [
        'User account with 2FA enabled',
        'Valid username and password',
        'Invalid 2FA code for testing',
      ],
      setup: 'Create user account with 2FA enabled',
    },
    testingMethod: 'smoke',
    categorizationReason: 'Critical error handling, smoke test coverage',
    priority: 'High',
    requirementId: 'ORD-1234',
  },
  {
    id: 'TC-DRAFT-004',
    title: 'Verify 2FA recovery flow with backup codes',
    description: 'User recovers account using backup codes when authenticator unavailable',
    testObjective: 'Verify that users can recover account access using backup codes',
    preconditions: [
      'User has 2FA enabled on their account',
      'User has previously saved backup codes',
      'User has lost access to authenticator app',
      'User is on the login page',
    ],
    testSteps: [
      {
        stepNumber: 1,
        action: 'Enter username and password, click Login',
        expectedResult: 'Login form validates credentials and prompts for 2FA code',
      },
      {
        stepNumber: 2,
        action: 'Click on "Lost access to authenticator?" link',
        expectedResult: 'Backup code entry option is displayed',
      },
      {
        stepNumber: 3,
        action: 'Enter a valid backup code',
        expectedResult: 'Backup code is accepted and user is authenticated',
      },
      {
        stepNumber: 4,
        action: 'Verify user is prompted to set up 2FA again',
        expectedResult: 'System prompts user to reconfigure 2FA',
      },
    ],
    postconditions: [
      'User is logged into the application',
      'Used backup code is invalidated',
      'User is prompted to set up new 2FA',
    ],
    testData: {
      required: [
        'User account with 2FA enabled',
        'Valid backup codes',
        'Valid username and password',
      ],
      setup: 'Create user account, enable 2FA, save backup codes',
    },
    testingMethod: 'manual',
    categorizationReason: 'Edge case scenario, manual testing sufficient',
    priority: 'Medium',
    requirementId: 'ORD-1234',
  },
  {
    id: 'TC-DRAFT-005',
    title: 'Verify 2FA timeout after 30 seconds',
    description: '2FA code expires after 30 seconds and user must request new code',
    testObjective: 'Verify that 2FA codes expire after the specified timeout period',
    preconditions: [
      'User has 2FA enabled on their account',
      'User is on the login page',
      'User has entered valid username and password',
      'System clock is synchronized',
    ],
    testSteps: [
      {
        stepNumber: 1,
        action: 'Enter username and password, click Login',
        expectedResult: 'Login form validates credentials and prompts for 2FA code',
      },
      {
        stepNumber: 2,
        action: 'Wait for 31 seconds without entering code',
        expectedResult: 'Code expires and error message displays: "Code expired. Please request a new code."',
      },
      {
        stepNumber: 3,
        action: 'Click "Request New Code" button',
        expectedResult: 'New code prompt is displayed',
      },
      {
        stepNumber: 4,
        action: 'Enter the new code from authenticator app',
        expectedResult: 'New code is accepted and user is authenticated',
      },
    ],
    postconditions: [
      'Expired code is rejected',
      'User can request and use new code',
      'User is authenticated after entering valid new code',
    ],
    testData: {
      required: [
        'User account with 2FA enabled',
        'Valid username and password',
        'Synchronized system clock for accurate timing',
      ],
      setup: 'Create user account with 2FA enabled, ensure system clock is accurate',
    },
    testingMethod: 'automation',
    categorizationReason: 'Time-sensitive scenario, automation ensures consistency',
    priority: 'Medium',
    requirementId: 'ORD-1234',
  },
  {
    id: 'TC-DRAFT-006',
    title: 'Verify 2FA disable with password verification',
    description: 'User disables 2FA by providing password confirmation',
    testObjective: 'Verify that users can disable 2FA with proper security verification',
    preconditions: [
      'User is logged into the application',
      'User has 2FA enabled on their account',
      'User has access to Account Settings',
    ],
    testSteps: [
      {
        stepNumber: 1,
        action: 'Navigate to Account Settings > Security',
        expectedResult: 'Security settings page displays with 2FA status shown as "Enabled"',
      },
      {
        stepNumber: 2,
        action: 'Click on "Disable Two-Factor Authentication" button',
        expectedResult: 'Password confirmation dialog appears',
      },
      {
        stepNumber: 3,
        action: 'Enter current password',
        expectedResult: 'Password is validated',
      },
      {
        stepNumber: 4,
        action: 'Click "Confirm Disable" button',
        expectedResult: '2FA is disabled and success message is displayed',
      },
      {
        stepNumber: 5,
        action: 'Verify 2FA status shows as "Disabled"',
        expectedResult: 'Security settings page shows 2FA as disabled',
      },
    ],
    postconditions: [
      '2FA is disabled for the user account',
      'User can log in without 2FA code',
      'Security settings reflect disabled status',
    ],
    testData: {
      required: [
        'User account with 2FA enabled',
        'Valid user password',
        'Access to Account Settings',
      ],
      setup: 'Create user account, enable 2FA, ensure user has password',
    },
    testingMethod: 'manual',
    categorizationReason: 'Security-sensitive operation, manual verification preferred',
    priority: 'Medium',
    requirementId: 'ORD-1234',
  },
];

// Requirements Data
export const requirements = [
  {
    id: 'ORD-1234',
    title: 'Add two-factor authentication to login flow',
    description: 'Users should be able to enable 2FA for enhanced security. The system must support authenticator apps and backup codes.',
    priority: 'High',
    status: 'Approved',
    acceptanceCriteria: [
      'Users can enable 2FA from account settings',
      'Users can scan QR code with authenticator app',
      'Users can log in with 2FA code',
      'Users can use backup codes when authenticator unavailable',
      '2FA codes expire after 30 seconds',
      'Users can disable 2FA with password verification',
    ],
    relatedWorkflows: ['WF-001', 'WF-002'],
    relatedScenarios: ['SC-001', 'SC-002'],
  },
];

// Traceability Matrix
export const traceabilityMatrix = [
  {
    requirementId: 'ORD-1234',
    requirementTitle: 'Add two-factor authentication to login flow',
    testCases: [
      'TC-DRAFT-001',
      'TC-DRAFT-002',
      'TC-DRAFT-003',
      'TC-DRAFT-004',
      'TC-DRAFT-005',
      'TC-DRAFT-006',
    ],
    coverage: 'complete',
    coveragePercentage: 100,
    testObjectives: [
      'Verify 2FA functionality meets security requirements',
      'Ensure authentication flows work correctly across all supported platforms',
    ],
  },
];

// Categorization Criteria
export const categorizationCriteria = {
  automation: {
    criteria: [
      'Repetitive execution required',
      'High frequency scenarios',
      'Core functionality needing regression testing',
      'Time-sensitive scenarios',
    ],
    examples: ['Login flows', 'API endpoints', 'Data validation'],
  },
  manual: {
    criteria: [
      'Edge case scenarios',
      'Security-sensitive operations',
      'Complex user interactions',
      'One-time verification scenarios',
    ],
    examples: ['Backup code recovery', '2FA disable', 'Complex workflows'],
  },
  smoke: {
    criteria: [
      'Critical error handling',
      'Basic functionality verification',
      'Quick validation scenarios',
    ],
    examples: ['Invalid input handling', 'Error messages', 'Basic flows'],
  },
};

// Test Data Management
export const testDataManagement = {
  strategy: 'Test data will be created per test execution cycle',
  setup: [
    'Create test user accounts',
    'Configure test environment',
    'Set up authenticator app test accounts',
    'Generate test backup codes',
  ],
  teardown: [
    'Clean up test user accounts',
    'Reset test environment state',
    'Clear test authentication tokens',
  ],
  privacy: [
    'No production data used',
    'Test data isolated from production',
    'Comply with data privacy regulations',
  ],
};

// Coverage Analysis Data
export const coverageAnalysis = {
  requirementCoverage: [
    {
      requirementId: 'ORD-1234',
      requirementTitle: 'Add two-factor authentication to login flow',
      coveragePercentage: 100,
      testCasesCount: 6,
      status: 'complete' as const,
    },
  ],
  overallCoverage: {
    requirementsCovered: 1,
    totalRequirements: 1,
    testCasesCount: 6,
    automationPercentage: 50, // 3 out of 6 test cases are automation
  },
  gaps: [
    'Consider adding negative test cases for edge scenarios',
    'Performance testing for 2FA code generation',
  ],
};

// Automation Requirements
export const automationRequirements = {
  automationTestCases: [
    {
      testCaseId: 'TC-DRAFT-001',
      testCaseTitle: 'Verify 2FA setup flow for new users',
      requiredInfo: {
        uiDesignAccess: true,
        testEnvironmentAccess: false,
        apiDocumentation: false,
        schemaInfo: false,
      },
      status: 'needs-ui-design',
    },
    {
      testCaseId: 'TC-DRAFT-002',
      testCaseTitle: 'Verify 2FA code validation (valid code)',
      requiredInfo: {
        uiDesignAccess: true,
        testEnvironmentAccess: true,
        apiDocumentation: false,
        schemaInfo: false,
      },
      status: 'ready',
    },
    {
      testCaseId: 'TC-DRAFT-005',
      testCaseTitle: 'Verify 2FA timeout after 30 seconds',
      requiredInfo: {
        uiDesignAccess: false,
        testEnvironmentAccess: true,
        apiDocumentation: true,
        schemaInfo: false,
      },
      status: 'ready',
    },
  ],
  productDevelopmentStage: 'development',
  uxDesignerContact: {
    name: 'Jane Designer',
    email: 'jane.designer@company.com',
    slack: '@jane-designer',
  },
  testEnvironmentStatus: 'not-available',
  figmaDesignLink: null,
};

// Automation Scripts
export const automationScripts = [
  {
    id: 'SCRIPT-001',
    testCaseId: 'TC-DRAFT-002',
    testCaseTitle: 'Verify 2FA code validation (valid code)',
    scriptType: 'Selenium',
    framework: 'WebDriver',
    status: 'drafted',
    requiredInfoStatus: {
      uiDesignAccess: 'available',
      testEnvironmentAccess: 'available',
    },
  },
  {
    id: 'SCRIPT-002',
    testCaseId: 'TC-DRAFT-005',
    testCaseTitle: 'Verify 2FA timeout after 30 seconds',
    scriptType: 'API Test',
    framework: 'REST Assured',
    status: 'drafted',
    requiredInfoStatus: {
      testEnvironmentAccess: 'available',
      apiDocumentation: 'available',
    },
  },
  {
    id: 'SCRIPT-003',
    testCaseId: 'TC-DRAFT-001',
    testCaseTitle: 'Verify 2FA setup flow for new users',
    scriptType: 'Selenium',
    framework: 'WebDriver',
    status: 'waiting-for-info',
    requiredInfoStatus: {
      uiDesignAccess: 'needed',
      testEnvironmentAccess: 'not-available',
    },
    blockingReason: 'Waiting for Figma design file with UI locators',
  },
];

// Enhanced Workflow Data
export const triageAnalysis = {
  requirementId: 'ORD-1234',
  completenessScore: 40,
  testabilityLevel: 'Low' as const,
  gaps: [
    { id: 1, type: 'missing-criteria', description: 'No acceptance criteria defined - requirement lacks measurable outcomes', severity: 'High' as const },
    { id: 2, type: 'ambiguous', description: 'Vague description - "set it up somehow" is not testable', severity: 'High' as const },
    { id: 3, type: 'missing-details', description: 'No implementation details - where/how users enable 2FA is unclear', severity: 'High' as const },
    { id: 4, type: 'missing-scenarios', description: 'No test scenarios or edge cases defined', severity: 'Medium' as const },
    { id: 5, type: 'missing-success', description: 'No success criteria or expected behavior specified', severity: 'High' as const },
  ],
  dependencies: [
    { id: 1, name: 'Authenticator App Integration', status: 'Unknown' as const },
    { id: 2, name: 'Database Schema Update', status: 'Unknown' as const },
  ],
  riskFlags: [
    { type: 'testability', description: 'Requirement is not testable in current state - cannot proceed with test design', impact: 'High' as const },
    { type: 'misinterpretation', description: 'High risk of misinterpretation due to vague language', impact: 'High' as const },
    { type: 'scope-creep', description: 'Lack of boundaries may lead to scope creep during implementation', impact: 'Medium' as const },
    { type: 'security', description: 'Security-critical feature requires detailed specification before testing', impact: 'High' as const },
  ],
  estimatedTestingEffort: 'Cannot estimate - requirement needs refinement',
  recommendedApproach: 'Immediate stakeholder collaboration required to define acceptance criteria, implementation details, and success metrics before test design can proceed',
};

export const approvalChains = {
  triage: [
    { id: 1, role: 'QA Analyst', name: 'Sarah Chen', status: 'pending' as const, order: 1 },
    { id: 2, role: 'QA Lead', name: 'Michael Torres', status: 'pending' as const, order: 2 },
    { id: 3, role: 'Test Manager', name: 'Emily Rodriguez', status: 'pending' as const, order: 3 },
  ],
  testDesign: [
    { id: 1, role: 'Peer Reviewer', name: 'Alex Kim', status: 'pending' as const, order: 1 },
    { id: 2, role: 'QA Lead', name: 'Michael Torres', status: 'pending' as const, order: 2 },
  ],
  testData: [
    { id: 1, role: 'Data Engineer', name: 'Jordan Lee', status: 'pending' as const, order: 1 },
  ],
};

export const approvalHistory: any[] = [];

export const automationFeasibility = {
  overallScore: 82,
  testCases: [
    {
      testCaseId: 'TC-DRAFT-001',
      feasibilityScore: 95,
      recommendedFramework: 'Selenium',
      browserCompatibility: ['Chrome', 'Firefox', 'Safari'],
      estimatedROI: 'High' as const,
      complexity: 'Medium' as const,
      maintenanceRisk: 'Low' as const,
    },
    {
      testCaseId: 'TC-DRAFT-002',
      feasibilityScore: 90,
      recommendedFramework: 'Selenium',
      browserCompatibility: ['Chrome', 'Firefox', 'Safari'],
      estimatedROI: 'High' as const,
      complexity: 'Low' as const,
      maintenanceRisk: 'Low' as const,
    },
    {
      testCaseId: 'TC-DRAFT-003',
      feasibilityScore: 88,
      recommendedFramework: 'Selenium',
      browserCompatibility: ['Chrome', 'Firefox', 'Safari'],
      estimatedROI: 'High' as const,
      complexity: 'Low' as const,
      maintenanceRisk: 'Low' as const,
    },
    {
      testCaseId: 'TC-DRAFT-004',
      feasibilityScore: 70,
      recommendedFramework: 'Playwright',
      browserCompatibility: ['Chrome', 'Firefox'],
      estimatedROI: 'Medium' as const,
      complexity: 'Medium' as const,
      maintenanceRisk: 'Medium' as const,
    },
    {
      testCaseId: 'TC-DRAFT-005',
      feasibilityScore: 85,
      recommendedFramework: 'Selenium',
      browserCompatibility: ['Chrome', 'Firefox', 'Safari'],
      estimatedROI: 'High' as const,
      complexity: 'Medium' as const,
      maintenanceRisk: 'Low' as const,
    },
    {
      testCaseId: 'TC-DRAFT-006',
      feasibilityScore: 65,
      recommendedFramework: 'Playwright',
      browserCompatibility: ['Chrome', 'Firefox'],
      estimatedROI: 'Medium' as const,
      complexity: 'High' as const,
      maintenanceRisk: 'Medium' as const,
    },
  ],
  frameworkRecommendation: {
    primary: 'Selenium WebDriver',
    alternative: 'Playwright',
    reasoning: 'Selenium recommended for broader cross-browser support and team familiarity',
  },
};

export const testDataStrategy = {
  requirements: [
    { entity: 'User Accounts', volume: '50 test users', type: 'Synthetic' },
    { entity: 'Authenticator Tokens', volume: '50 tokens', type: 'Generated' },
    { entity: 'Backup Codes', volume: '500 codes', type: 'Generated' },
  ],
  generationStrategy: 'Automated test data generation using Factory pattern with Faker library',
  privacyCompliance: ['GDPR', 'CCPA'],
  dataRefreshFrequency: 'Per test suite execution',
  setupScripts: ['create_test_users.sql', 'generate_2fa_tokens.js'],
  teardownScripts: ['cleanup_test_data.sql'],
  dependencies: ['Test database', 'Test authenticator service'],
};

export const sampleBlockers = [
  {
    id: 'BLK-001',
    type: 'Ambiguous Requirement' as const,
    description: '2FA timeout duration not specified in acceptance criteria',
    impact: 'Blocks test case finalization',
    owner: 'Product Manager - Sarah Johnson',
    status: 'Escalated' as const,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    escalationLevel: 1,
    estimatedResolutionTime: '2-4 hours',
  },
];

export const escalationChain = [
  { level: 1, role: 'QA Lead', name: 'Michael Torres', slaHours: 2, status: 'current' as const },
  { level: 2, role: 'Engineering Manager', name: 'David Park', slaHours: 4, status: 'pending' as const },
  { level: 3, role: 'Product Manager', name: 'Sarah Johnson', slaHours: 24, status: 'pending' as const },
];

export const communicationLog = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 1800000),
    from: 'Ordino AI',
    to: 'Michael Torres',
    channel: 'slack' as const,
    message: 'Blocker detected: 2FA timeout duration not specified in acceptance criteria.',
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 1200000),
    from: 'Michael Torres',
    to: 'David Park',
    channel: 'slack' as const,
    message: 'Escalating blocker - need product clarification on timeout requirements.',
  },
];
