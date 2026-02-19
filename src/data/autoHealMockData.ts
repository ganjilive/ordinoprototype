// Auto-Heal Demo Mock Data

export interface FailingTest {
  id: string;
  name: string;
  errorType: string;
  errorMessage: string;
  file: string;
  line: number;
  duration: string;
  lastPassed: string;
}

export interface ClassificationCheck {
  label: string;
  result: string;
  passed: boolean;
}

export interface TestClassification {
  testId: string;
  category: string;
  confidence: number;
  color: string;
  checks: ClassificationCheck[];
  strategy: string;
}

export interface GitDiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
}

export interface ChangeCorrelationEntry {
  testId: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  timestamp: string;
  file: string;
  causalConfidence: number;
  diff: GitDiffLine[];
}

export interface HealingStrategy {
  testId: string;
  strategyName: string;
  confidence: number;
  autoApprove: boolean;
  before: string[];
  after: string[];
  explanation: string;
}

export interface SandboxResult {
  testId: string;
  passed: boolean;
  duration: string;
  healingScore: number;
  pipelineStages: { label: string; status: 'pass' | 'fail' | 'skip' }[];
}

export interface SlackHealMessage {
  id: string;
  recipient: string;
  channel: string;
  message: string;
}

export interface HealingCommit {
  testId: string;
  prNumber: string;
  prTitle: string;
  branch: string;
  ciStatus: 'passing' | 'pending';
  jiraTicket: string;
  healingStrategy: string;
  confidence: number;
  autoCommitted: boolean;
}

export interface HealingSummaryRow {
  testId: string;
  errorType: string;
  strategy: string;
  confidence: number;
  autoCommitted: boolean;
  status: 'healed' | 'approved';
}

export interface AutoHealTimeMetric {
  manual: number;
  ordino: number;
}

// ── Step 1: Failure Detected ──────────────────────────────────────────────────

export const failingTests: FailingTest[] = [
  {
    id: 'AT-112',
    name: 'checkout_submit_button_visible',
    errorType: 'ElementNotFoundError',
    errorMessage: '[data-testid="submit-btn"] not found after 5000ms',
    file: 'tests/checkout/submit.spec.ts',
    line: 47,
    duration: '5.2s',
    lastPassed: '2 days ago',
  },
  {
    id: 'AT-089',
    name: 'user_profile_fullName_response',
    errorType: 'AssertionError',
    errorMessage: "Expected response.body.fullName to exist, got undefined",
    file: 'tests/api/user-profile.spec.ts',
    line: 83,
    duration: '1.1s',
    lastPassed: '1 day ago',
  },
  {
    id: 'AT-203',
    name: 'checkout_modal_open_flow',
    errorType: 'TimeoutError',
    errorMessage: '.checkout-modal did not appear within 10000ms',
    file: 'tests/checkout/modal.spec.ts',
    line: 29,
    duration: '10.3s',
    lastPassed: '3 days ago',
  },
];

// ── Step 2: Failure Classification ───────────────────────────────────────────

export const testClassifications: TestClassification[] = [
  {
    testId: 'AT-112',
    category: 'Locator Healing',
    confidence: 96,
    color: 'ordino-success',
    checks: [
      { label: 'DOM element exists', result: 'Yes (class changed)', passed: true },
      { label: 'Selector stale', result: 'data-testid renamed', passed: true },
      { label: 'Alternate found', result: '.btn-submit', passed: true },
    ],
    strategy: 'Update selector to .btn-submit',
  },
  {
    testId: 'AT-089',
    category: 'Schema Repair',
    confidence: 88,
    color: 'ordino-primary',
    checks: [
      { label: 'API contract changed', result: 'fullName → full_name', passed: true },
      { label: 'Schema version', result: 'v2 deployed', passed: true },
      { label: 'Backward compat', result: 'No alias provided', passed: false },
    ],
    strategy: 'Update assertion to response.body.full_name',
  },
  {
    testId: 'AT-203',
    category: 'Flow Step Insertion',
    confidence: 71,
    color: 'ordino-warning',
    checks: [
      { label: 'New prerequisite step', result: 'Cart requires login', passed: true },
      { label: 'Login flow present', result: 'Not in test setup', passed: false },
      { label: 'Recovery path', result: 'Ambiguous — multiple flows', passed: false },
    ],
    strategy: 'Insert login step before modal trigger (requires review)',
  },
];

// ── Step 3: Change Correlation ────────────────────────────────────────────────

export const changeCorrelations: ChangeCorrelationEntry[] = [
  {
    testId: 'AT-112',
    commitHash: 'a3f9c12',
    commitMessage: 'refactor(checkout): rename submit button class for BEM compliance',
    author: 'Maya R.',
    timestamp: '2 days ago',
    file: 'src/components/Checkout/SubmitButton.tsx',
    causalConfidence: 97,
    diff: [
      { type: 'context', content: ' <button' },
      { type: 'remove', content: '-  data-testid="submit-btn"' },
      { type: 'add', content: '+  className="btn-submit"' },
      { type: 'context', content: ' >' },
    ],
  },
  {
    testId: 'AT-089',
    commitHash: 'b7d2e44',
    commitMessage: 'feat(api): migrate user profile schema to snake_case v2',
    author: 'James K.',
    timestamp: '1 day ago',
    file: 'src/api/routes/user.ts',
    causalConfidence: 91,
    diff: [
      { type: 'context', content: ' return {' },
      { type: 'remove', content: '-  fullName: user.fullName,' },
      { type: 'add', content: '+  full_name: user.fullName,' },
      { type: 'context', content: ' }' },
    ],
  },
  {
    testId: 'AT-203',
    commitHash: 'c1a8f55',
    commitMessage: 'feat(auth): require login before checkout flow',
    author: 'Priya S.',
    timestamp: '3 days ago',
    file: 'src/middleware/checkoutGuard.ts',
    causalConfidence: 74,
    diff: [
      { type: 'context', content: ' export function checkoutGuard(req) {' },
      { type: 'add', content: '+  if (!req.user) redirect("/login");' },
      { type: 'context', content: '   openCheckoutModal();' },
      { type: 'context', content: ' }' },
    ],
  },
];

// ── Step 4: Healing Strategy Selected ────────────────────────────────────────

export const healingStrategies: HealingStrategy[] = [
  {
    testId: 'AT-112',
    strategyName: 'Locator Healing',
    confidence: 96,
    autoApprove: true,
    before: [
      "await page.click('[data-testid=\"submit-btn\"]');",
      "await expect(page.locator('[data-testid=\"submit-btn\"]'))",
      "  .toBeVisible();",
    ],
    after: [
      "await page.click('.btn-submit');",
      "await expect(page.locator('.btn-submit'))",
      "  .toBeVisible();",
    ],
    explanation: 'Replace deprecated data-testid with the new BEM class selector.',
  },
  {
    testId: 'AT-089',
    strategyName: 'Schema Repair',
    confidence: 88,
    autoApprove: true,
    before: [
      "expect(response.body.fullName).toBeDefined();",
      "expect(response.body.fullName).toBe('John Doe');",
    ],
    after: [
      "expect(response.body.full_name).toBeDefined();",
      "expect(response.body.full_name).toBe('John Doe');",
    ],
    explanation: 'Update assertion field name to match v2 API snake_case schema.',
  },
  {
    testId: 'AT-203',
    strategyName: 'Flow Step Insertion',
    confidence: 71,
    autoApprove: false,
    before: [
      "await page.goto('/checkout');",
      "await page.waitForSelector('.checkout-modal');",
    ],
    after: [
      "await page.goto('/login');",
      "await page.fill('#email', testUser.email);",
      "await page.fill('#password', testUser.password);",
      "await page.click('[type=\"submit\"]');",
      "await page.goto('/checkout');",
      "await page.waitForSelector('.checkout-modal');",
    ],
    explanation: 'Insert login flow before checkout navigation — confidence 71, requires human review.',
  },
];

// ── Step 5: Sandbox Validation ────────────────────────────────────────────────

export const sandboxResults: SandboxResult[] = [
  {
    testId: 'AT-112',
    passed: true,
    duration: '1.8s',
    healingScore: 96,
    pipelineStages: [
      { label: 'Lint', status: 'pass' },
      { label: 'Unit', status: 'pass' },
      { label: 'Integration', status: 'pass' },
      { label: 'E2E', status: 'pass' },
    ],
  },
  {
    testId: 'AT-089',
    passed: true,
    duration: '0.9s',
    healingScore: 88,
    pipelineStages: [
      { label: 'Lint', status: 'pass' },
      { label: 'Unit', status: 'pass' },
      { label: 'Integration', status: 'pass' },
      { label: 'E2E', status: 'pass' },
    ],
  },
  {
    testId: 'AT-203',
    passed: true,
    duration: '3.1s',
    healingScore: 71,
    pipelineStages: [
      { label: 'Lint', status: 'pass' },
      { label: 'Unit', status: 'pass' },
      { label: 'Integration', status: 'pass' },
      { label: 'E2E', status: 'pass' },
    ],
  },
];

// ── Step 6: QA Review Gate ────────────────────────────────────────────────────

export const qaSlackMessages: SlackHealMessage[] = [
  {
    id: 'msg-1',
    recipient: '@alex.nguyen',
    channel: '#qa-engineers',
    message:
      'AT-203 healing confidence is 71/100 — Flow Step Insertion may alter intended test scope. Please review the proposed login step insertion before auto-commit.',
  },
  {
    id: 'msg-2',
    recipient: '@priya.sharma',
    channel: '#dev-checkout',
    message:
      'AT-203 repair correlates to your commit c1a8f55. Can you confirm the checkout guard now requires authenticated users before modal opens?',
  },
];

// ── Step 7: Healed & Committed ────────────────────────────────────────────────

export const healingCommits: HealingCommit[] = [
  {
    testId: 'AT-112',
    prNumber: 'PR #841',
    prTitle: 'fix(tests): heal AT-112 locator selector update',
    branch: 'ordino/heal/AT-112',
    ciStatus: 'passing',
    jiraTicket: 'QA-441',
    healingStrategy: 'Locator Healing',
    confidence: 96,
    autoCommitted: true,
  },
  {
    testId: 'AT-089',
    prNumber: 'PR #842',
    prTitle: 'fix(tests): heal AT-089 API schema assertion repair',
    branch: 'ordino/heal/AT-089',
    ciStatus: 'passing',
    jiraTicket: 'QA-442',
    healingStrategy: 'Schema Repair',
    confidence: 88,
    autoCommitted: true,
  },
  {
    testId: 'AT-203',
    prNumber: 'PR #843',
    prTitle: 'fix(tests): heal AT-203 checkout flow step insertion',
    branch: 'ordino/heal/AT-203',
    ciStatus: 'passing',
    jiraTicket: 'QA-443',
    healingStrategy: 'Flow Step Insertion',
    confidence: 71,
    autoCommitted: false,
  },
];

export const healingSummary: HealingSummaryRow[] = [
  {
    testId: 'AT-112',
    errorType: 'ElementNotFoundError',
    strategy: 'Locator Healing',
    confidence: 96,
    autoCommitted: true,
    status: 'healed',
  },
  {
    testId: 'AT-089',
    errorType: 'AssertionError',
    strategy: 'Schema Repair',
    confidence: 88,
    autoCommitted: true,
    status: 'healed',
  },
  {
    testId: 'AT-203',
    errorType: 'TimeoutError',
    strategy: 'Flow Step Insertion',
    confidence: 71,
    autoCommitted: false,
    status: 'approved',
  },
];

// ── Time Metrics ──────────────────────────────────────────────────────────────

export const autoHealTimeMetrics: AutoHealTimeMetric[] = [
  { manual: 0, ordino: 0 },    // Start
  { manual: 5, ordino: 3 },    // Failure Detected
  { manual: 20, ordino: 4 },   // Failure Classification
  { manual: 30, ordino: 5 },   // Change Correlation
  { manual: 25, ordino: 6 },   // Healing Strategy Selected
  { manual: 10, ordino: 8 },   // Sandbox Validation
  { manual: 0, ordino: 0 },    // Human Review (excluded — variable)
  { manual: 0, ordino: 3 },    // Healed & Committed
];
