import type { TestExecution, BugReport, PipelineStage } from '../types';

// Repository Configuration
export const repositoryConfig = {
  name: 'test-automation-scripts',
  url: 'https://github.com/company/test-automation-scripts',
  branch: 'main',
  cloneCommand: 'git clone https://github.com/company/test-automation-scripts.git',
  fileTree: [
    { name: 'test-automation-scripts/', type: 'folder', level: 0 },
    { name: 'src/', type: 'folder', level: 1 },
    { name: 'tests/', type: 'folder', level: 2 },
    { name: 'selenium/', type: 'folder', level: 3 },
    { name: 'TwoFactorSetupTest.java', type: 'file', level: 4 },
    { name: 'TwoFactorValidationTest.java', type: 'file', level: 4 },
    { name: 'LoginFlowTest.java', type: 'file', level: 4 },
    { name: 'api/', type: 'folder', level: 3 },
    { name: 'AuthApiTest.java', type: 'file', level: 4 },
    { name: 'TimeoutHandlingTest.java', type: 'file', level: 4 },
    { name: 'config/', type: 'folder', level: 2 },
    { name: 'test-config.json', type: 'file', level: 3 },
    { name: 'pom.xml', type: 'file', level: 1 },
    { name: 'README.md', type: 'file', level: 1 },
  ],
};

// Test Suite
export const testSuite: TestExecution[] = [
  {
    id: 'TC-001',
    name: 'TwoFactorSetupTest',
    description: 'Verify 2FA setup flow for new users',
    status: 'pending',
  },
  {
    id: 'TC-002',
    name: 'TwoFactorValidationTest',
    description: 'Verify 2FA code validation (valid code)',
    status: 'pending',
  },
  {
    id: 'TC-003',
    name: 'InvalidCodeTest',
    description: 'Verify 2FA code validation (invalid code)',
    status: 'pending',
  },
  {
    id: 'TC-004',
    name: 'RecoveryFlowTest',
    description: 'Verify 2FA recovery flow with backup codes',
    status: 'pending',
  },
  {
    id: 'TC-005',
    name: 'TimeoutHandlingTest',
    description: 'Verify 2FA timeout after 30 seconds',
    status: 'pending',
  },
  {
    id: 'TC-006',
    name: 'DisableFlowTest',
    description: 'Verify 2FA disable with password verification',
    status: 'pending',
  },
  {
    id: 'TC-007',
    name: 'BackupCodesGenerationTest',
    description: 'Verify backup codes generation (10 codes)',
    status: 'pending',
  },
  {
    id: 'TC-008',
    name: 'BackupCodeUsageTest',
    description: 'Verify single-use backup code consumption',
    status: 'pending',
  },
  {
    id: 'TC-009',
    name: 'LoginFlowIntegrationTest',
    description: 'Verify complete login flow with 2FA',
    status: 'pending',
  },
  {
    id: 'TC-010',
    name: 'SessionManagementTest',
    description: 'Verify session token management after 2FA',
    status: 'pending',
  },
  {
    id: 'TC-011',
    name: 'AuthApiSecurityTest',
    description: 'Verify API endpoint security',
    status: 'pending',
  },
  {
    id: 'TC-012',
    name: 'RateLimitingTest',
    description: 'Verify rate limiting for 2FA attempts',
    status: 'pending',
  },
  {
    id: 'TC-013',
    name: 'ConcurrentLoginTest',
    description: 'Verify concurrent login handling',
    status: 'pending',
  },
  {
    id: 'TC-014',
    name: 'BrowserCompatibilityTest',
    description: 'Verify cross-browser compatibility',
    status: 'pending',
  },
  {
    id: 'TC-015',
    name: 'MobileResponsiveTest',
    description: 'Verify mobile responsive design',
    status: 'pending',
  },
];

// Test Results (predetermined for demo)
export const testResults: Record<string, { status: 'passed' | 'failed' | 'skipped'; duration: number; errorMessage?: string }> = {
  'TC-001': { status: 'passed', duration: 3.2 },
  'TC-002': { status: 'passed', duration: 2.8 },
  'TC-003': { status: 'failed', duration: 1.9, errorMessage: 'AssertionError: Expected error message not displayed' },
  'TC-004': { status: 'passed', duration: 4.1 },
  'TC-005': { status: 'passed', duration: 5.3 },
  'TC-006': { status: 'passed', duration: 3.7 },
  'TC-007': { status: 'passed', duration: 2.4 },
  'TC-008': { status: 'failed', duration: 2.1, errorMessage: 'TimeoutError: Backup code validation timed out' },
  'TC-009': { status: 'passed', duration: 6.2 },
  'TC-010': { status: 'passed', duration: 3.9 },
  'TC-011': { status: 'failed', duration: 2.7, errorMessage: 'SecurityError: Missing CSRF token validation' },
  'TC-012': { status: 'passed', duration: 8.1 },
  'TC-013': { status: 'passed', duration: 4.5 },
  'TC-014': { status: 'passed', duration: 12.3 },
  'TC-015': { status: 'skipped', duration: 0 },
};

// Discovered Bugs (linked to failed tests)
export const discoveredBugs: BugReport[] = [
  {
    id: 'BUG-001',
    jiraKey: 'ORD-1501',
    title: 'Invalid code error message not displayed correctly',
    severity: 'Medium',
    linkedTestId: 'TC-003',
    status: 'created',
  },
  {
    id: 'BUG-002',
    jiraKey: 'ORD-1502',
    title: 'Backup code validation timeout under load',
    severity: 'High',
    linkedTestId: 'TC-008',
    status: 'created',
  },
  {
    id: 'BUG-003',
    jiraKey: 'ORD-1503',
    title: 'CSRF token validation missing on auth API endpoint',
    severity: 'Critical',
    linkedTestId: 'TC-011',
    status: 'created',
  },
];

// Pipeline Stages
export const pipelineStages: PipelineStage[] = [
  { id: 'build', name: 'Build', status: 'pending' },
  { id: 'unit-tests', name: 'Unit Tests', status: 'pending' },
  { id: 'integration-tests', name: 'Integration Tests', status: 'pending' },
  { id: 'security-scan', name: 'Security Scan', status: 'pending' },
  { id: 'deploy-staging', name: 'Deploy to Staging', status: 'pending' },
];

// Commit Details
export const commitDetails = {
  hash: 'a7f3c2d',
  message: 'Add test execution results for ORD-1234 2FA feature',
  author: 'Ordino AI',
  branch: 'feature/2fa-test-results',
  filesChanged: 5,
  additions: 312,
  deletions: 47,
  changedFiles: [
    { name: 'test-results/ORD-1234-results.xml', status: 'added' },
    { name: 'test-results/ORD-1234-report.html', status: 'added' },
    { name: 'coverage/lcov.info', status: 'modified' },
    { name: 'README.md', status: 'modified' },
    { name: 'config/test-config.json', status: 'modified' },
  ],
};

// Report Types
export const reportTypes = [
  { id: 'html', name: 'HTML Report', description: 'Interactive test execution report', icon: 'FileText' },
  { id: 'junit', name: 'JUnit XML', description: 'CI/CD compatible test results', icon: 'Code' },
  { id: 'coverage', name: 'Coverage Report', description: 'Code coverage analysis', icon: 'BarChart' },
  { id: 'allure', name: 'Allure Report', description: 'Detailed test analytics', icon: 'PieChart' },
];

// Dashboard Metrics (before/after)
export const dashboardMetrics = {
  before: {
    passRate: 89.2,
    totalTests: 142,
    coverage: 76.5,
    openBugs: 8,
  },
  after: {
    passRate: 80.0, // 12/15 passed
    totalTests: 157, // +15 new tests
    coverage: 82.3, // Improved
    openBugs: 11, // +3 new bugs
  },
};

// Chat Responses (for step 8)
export const chatResponses: Record<string, string> = {
  'pass rate': `The overall pass rate for this test execution was **80%** (12 out of 15 tests passed).

**Breakdown:**
- Passed: 12 tests
- Failed: 3 tests
- Skipped: 1 test

The failed tests are related to error handling and security validation. I recommend prioritizing the CSRF vulnerability fix (ORD-1503) as it's marked as Critical severity.`,

  'failed tests': `**3 tests failed** during this execution:

1. **TC-003 - InvalidCodeTest**
   - Error: AssertionError: Expected error message not displayed
   - Bug: ORD-1501 (Medium)

2. **TC-008 - BackupCodeUsageTest**
   - Error: TimeoutError: Backup code validation timed out
   - Bug: ORD-1502 (High)

3. **TC-011 - AuthApiSecurityTest**
   - Error: SecurityError: Missing CSRF token validation
   - Bug: ORD-1503 (Critical)

Would you like me to provide more details on any specific failure?`,

  'coverage': `The current **code coverage is 82.3%**, up from 76.5% before this test run.

**Coverage by Module:**
- Authentication: 94%
- 2FA Setup: 88%
- Recovery Flow: 79%
- API Endpoints: 81%
- Session Management: 76%

The lowest coverage is in Session Management. Consider adding more tests for edge cases in token refresh scenarios.`,

  'trends': `**Test Execution Trends** (Last 5 runs):

| Run | Pass Rate | Duration | New Bugs |
|-----|-----------|----------|----------|
| #5 (Current) | 80.0% | 63.2s | 3 |
| #4 | 89.2% | 58.1s | 1 |
| #3 | 85.7% | 61.4s | 2 |
| #2 | 92.1% | 55.3s | 0 |
| #1 | 78.6% | 67.8s | 4 |

The pass rate dropped due to new security-related test cases. This is expected as we've expanded test coverage for the 2FA feature.`,

  'bugs': `**3 new bugs** were created from this test execution:

1. **ORD-1503** (Critical) - CSRF token validation missing
   - Priority: Immediate fix required
   - Assigned to: Security Team

2. **ORD-1502** (High) - Backup code validation timeout
   - Priority: Fix in next sprint
   - Assigned to: Backend Team

3. **ORD-1501** (Medium) - Error message display issue
   - Priority: Fix in current sprint
   - Assigned to: Frontend Team

All bugs have been linked to their respective failed test cases in Jira.`,

  'recommendations': `Based on the test execution results, here are my **recommendations**:

**Immediate Actions:**
1. Fix ORD-1503 (CSRF vulnerability) before production deployment
2. Investigate TC-008 timeout issue - may indicate performance regression

**Short-term Improvements:**
- Add retry logic for flaky timeout tests
- Increase coverage for Session Management module
- Add negative test cases for rate limiting

**Test Suite Health:**
- Consider parallelizing browser compatibility tests
- The skipped test (TC-015) should be re-enabled after mobile build fix`,
};

// Suggested Questions for Chat
export const suggestedQuestions = [
  'What was the pass rate?',
  'Which tests failed?',
  'Show me the coverage report',
  'What are the trends?',
  'List the new bugs',
  'Give me recommendations',
];

// Time/Cost Metrics for Test Execution Demo
export const executionTimeMetrics = [
  { manual: 0, ordino: 0 },      // Step 0 (Start)
  { manual: 15, ordino: 2 },     // Clone Repository
  { manual: 60, ordino: 5 },     // Execute Tests
  { manual: 30, ordino: 3 },     // Report Bugs
  { manual: 20, ordino: 1 },     // Commit Scripts (Approval)
  { manual: 45, ordino: 8 },     // Pipeline Execution
  { manual: 15, ordino: 2 },     // Generate Results
  { manual: 20, ordino: 3 },     // Update Dashboards
  { manual: 0, ordino: 0 },      // Chat
];
