import type { VSCodeLine, VSCodeCoverage } from '../types';

export const vscodeCoverage: VSCodeCoverage = {
  overall: 64.3,
  functions: 58.0,
  branches: 51.2,
  uncoveredFunctions: [
    {
      name: 'handleExpiredTokens',
      startLine: 24,
      endLine: 32,
      reason: 'No test for token expiry edge case',
    },
    {
      name: 'rejectInvalidFormats',
      startLine: 34,
      endLine: 42,
      reason: 'Format validation paths untested',
    },
    {
      name: 'refreshSession',
      startLine: 44,
      endLine: 50,
      reason: 'Partial — happy path only, error branch missing',
    },
  ],
};

export const vscodeLines: VSCodeLine[] = [
  {
    lineNumber: 1,
    tokens: [
      { text: 'import', color: '#569cd6' },
      { text: ' { describe, it, expect, beforeEach } ', color: '#d4d4d4' },
      { text: 'from', color: '#569cd6' },
      { text: " 'vitest'", color: '#ce9178' },
      { text: ';', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 2,
    tokens: [
      { text: 'import', color: '#569cd6' },
      { text: ' { AuthService } ', color: '#d4d4d4' },
      { text: 'from', color: '#569cd6' },
      { text: " '../services/AuthService'", color: '#ce9178' },
      { text: ';', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 3,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 4,
    tokens: [
      { text: 'describe', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'AuthService'", color: '#ce9178' },
      { text: ', () => {', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 5,
    tokens: [
      { text: '  let', color: '#569cd6' },
      { text: ' authService: ', color: '#d4d4d4' },
      { text: 'AuthService', color: '#4ec9b0' },
      { text: ';', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 6,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 7,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: 'beforeEach', color: '#dcdcaa' },
      { text: '(() => {', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 8,
    tokens: [
      { text: '    authService = ', color: '#d4d4d4' },
      { text: 'new', color: '#569cd6' },
      { text: ' ', color: '#d4d4d4' },
      { text: 'AuthService', color: '#4ec9b0' },
      { text: '();', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 9,
    tokens: [{ text: '  });', color: '#d4d4d4' }],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 10,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 11,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: 'it', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'validates a correct 2FA code'", color: '#ce9178' },
      { text: ', () => {', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 12,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'const', color: '#569cd6' },
      { text: ' result = authService.', color: '#d4d4d4' },
      { text: 'validate', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'123456'", color: '#ce9178' },
      { text: ');', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 13,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'expect', color: '#dcdcaa' },
      { text: '(result).', color: '#d4d4d4' },
      { text: 'toBe', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: 'true', color: '#569cd6' },
      { text: ');', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 14,
    tokens: [{ text: '  });', color: '#d4d4d4' }],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 15,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 16,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: 'it', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'rejects an incorrect 2FA code'", color: '#ce9178' },
      { text: ', () => {', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 17,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'const', color: '#569cd6' },
      { text: ' result = authService.', color: '#d4d4d4' },
      { text: 'validate', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'000000'", color: '#ce9178' },
      { text: ');', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 18,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'expect', color: '#dcdcaa' },
      { text: '(result).', color: '#d4d4d4' },
      { text: 'toBe', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: 'false', color: '#569cd6' },
      { text: ');', color: '#d4d4d4' },
    ],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 19,
    tokens: [{ text: '  });', color: '#d4d4d4' }],
    coverageStatus: 'covered',
  },
  {
    lineNumber: 20,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 21,
    tokens: [
      { text: '  // ', color: '#6a9955' },
      { text: 'TODO: add tests for expired tokens, invalid formats, session refresh', color: '#6a9955' },
    ],
    coverageStatus: 'none',
  },
  {
    lineNumber: 22,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 23,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: '/* UNCOVERED */  handleExpiredTokens', color: '#d4d4d4' },
    ],
    coverageStatus: 'none',
  },
  {
    lineNumber: 24,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: 'it', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'handles expired tokens'", color: '#ce9178' },
      { text: ', () => {', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 25,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'const', color: '#569cd6' },
      { text: ' expiredToken = authService.', color: '#d4d4d4' },
      { text: 'createExpiredToken', color: '#dcdcaa' },
      { text: '();', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 26,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'expect', color: '#dcdcaa' },
      { text: '(() => authService.', color: '#d4d4d4' },
      { text: 'validate', color: '#dcdcaa' },
      { text: '(expiredToken))', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 27,
    tokens: [
      { text: '      .', color: '#d4d4d4' },
      { text: 'toThrow', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: 'TokenExpiredException', color: '#4ec9b0' },
      { text: ');', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 28,
    tokens: [{ text: '  });', color: '#d4d4d4' }],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 29,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 30,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: '/* UNCOVERED */  rejectInvalidFormats', color: '#d4d4d4' },
    ],
    coverageStatus: 'none',
  },
  {
    lineNumber: 31,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: 'it', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'rejects invalid code formats'", color: '#ce9178' },
      { text: ', () => {', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 32,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'const', color: '#569cd6' },
      { text: ' invalidCodes = [', color: '#d4d4d4' },
      { text: "'abc'", color: '#ce9178' },
      { text: ', ', color: '#d4d4d4' },
      { text: "'12345'", color: '#ce9178' },
      { text: ', ', color: '#d4d4d4' },
      { text: 'null', color: '#569cd6' },
      { text: '];', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 33,
    tokens: [
      { text: '    invalidCodes.', color: '#d4d4d4' },
      { text: 'forEach', color: '#dcdcaa' },
      { text: '(code => {', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 34,
    tokens: [
      { text: '      ', color: '#d4d4d4' },
      { text: 'expect', color: '#dcdcaa' },
      { text: '(() => authService.', color: '#d4d4d4' },
      { text: 'validate', color: '#dcdcaa' },
      { text: '(code as ', color: '#d4d4d4' },
      { text: 'string', color: '#569cd6' },
      { text: '))', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 35,
    tokens: [
      { text: '        .', color: '#d4d4d4' },
      { text: 'toThrow', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: 'InvalidFormatException', color: '#4ec9b0' },
      { text: ');', color: '#d4d4d4' },
    ],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 36,
    tokens: [{ text: '    });', color: '#d4d4d4' }],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 37,
    tokens: [{ text: '  });', color: '#d4d4d4' }],
    coverageStatus: 'uncovered',
  },
  {
    lineNumber: 38,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 39,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: '/* PARTIAL */  refreshSession', color: '#d4d4d4' },
    ],
    coverageStatus: 'none',
  },
  {
    lineNumber: 40,
    tokens: [
      { text: '  ', color: '#d4d4d4' },
      { text: 'it', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'refreshes session on valid token'", color: '#ce9178' },
      { text: ', () => {', color: '#d4d4d4' },
    ],
    coverageStatus: 'partial',
  },
  {
    lineNumber: 41,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'const', color: '#569cd6' },
      { text: ' newToken = authService.', color: '#d4d4d4' },
      { text: 'refreshSession', color: '#dcdcaa' },
      { text: '(', color: '#d4d4d4' },
      { text: "'valid-session-id'", color: '#ce9178' },
      { text: ');', color: '#d4d4d4' },
    ],
    coverageStatus: 'partial',
  },
  {
    lineNumber: 42,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: 'expect', color: '#dcdcaa' },
      { text: '(newToken).', color: '#d4d4d4' },
      { text: 'toBeDefined', color: '#dcdcaa' },
      { text: '();', color: '#d4d4d4' },
    ],
    coverageStatus: 'partial',
  },
  {
    lineNumber: 43,
    tokens: [
      { text: '    ', color: '#d4d4d4' },
      { text: '// error path not tested', color: '#6a9955' },
    ],
    coverageStatus: 'partial',
  },
  {
    lineNumber: 44,
    tokens: [{ text: '  });', color: '#d4d4d4' }],
    coverageStatus: 'partial',
  },
  {
    lineNumber: 45,
    tokens: [{ text: '', color: '#d4d4d4' }],
    coverageStatus: 'none',
  },
  {
    lineNumber: 46,
    tokens: [{ text: '});', color: '#d4d4d4' }],
    coverageStatus: 'covered',
  },
];

export const vscodeKeywordResponses: Record<string, string> = {
  'coverage|overall|percent|percentage':
    '**Coverage: 64.3% overall**\n\n• Statement: 64.3%\n• Function: 58.0%\n• Branch: 51.2%\n\nThe file has solid coverage on the happy-path tests (lines 1–22) but the 3 new test stubs for token expiry, invalid formats, and session refresh are **not executing** — they were written but the underlying service methods may not be implemented yet.',

  'uncovered|missing|not covered|gaps':
    '**3 uncovered code regions:**\n\n1. `handleExpiredTokens` — Lines 24–28\n   No test runs this path. Token expiry exception is never thrown in tests.\n\n2. `rejectInvalidFormats` — Lines 31–37\n   Format validation paths completely untested. The `null`, `"abc"`, `"12345"` cases are never reached.\n\n3. `refreshSession` — Lines 40–44 (partial)\n   Happy path covered, error branch (invalid session ID) is not tested.',

  'function|functions|which functions|fn':
    '**Uncovered functions (3):**\n\n• `handleExpiredTokens` — starts at L24\n  → 0% coverage, token expiry exception path\n\n• `rejectInvalidFormats` — starts at L34\n  → 0% coverage, format validation\n\n• `refreshSession` — starts at L44\n  → Partial: happy path only, error branch uncovered\n\nFunction coverage: **58.0%** (3 of ~7 functions covered)',

  'add test|write test|generate test|new test|create test':
    "**Suggested test to add first — `handleExpiredTokens` (L24):**\n\n```typescript\nit('throws TokenExpiredException for expired token', () => {\n  const expiredToken = authService.createExpiredToken();\n  expect(() => authService.validate(expiredToken))\n    .toThrow(TokenExpiredException);\n});\n```\n\nThis is the highest-priority gap as token expiry is a security-critical path. After this, address `rejectInvalidFormats` with null/empty/short code inputs.",

  'report|summary|breakdown|table':
    '**Coverage Report — auth.test.ts**\n\n| Function | Lines | Status | Coverage |\n|---|---|---|---|\n| validateCorrectCode | 11–14 | Covered | 100% |\n| rejectIncorrectCode | 16–19 | Covered | 100% |\n| handleExpiredTokens | 24–28 | Uncovered | 0% |\n| rejectInvalidFormats | 31–37 | Uncovered | 0% |\n| refreshSession | 40–44 | Partial | ~50% |\n\n**Overall: 64.3%**',

  'branch|branches|branch coverage':
    '**Branch Coverage: 51.2%**\n\nUncovered branches:\n• `TokenExpiredException` throw path (L26–27)\n• `InvalidFormatException` throw path (L34–35)\n• Session refresh error branch (L43)\n• `null` code input path in format parser\n\nBranch coverage is the weakest metric here. Adding error-path tests for the 3 uncovered functions would bring branch coverage to ~75%.',

  'improve|how to improve|increase|boost|raise':
    '**How to increase coverage from 64.3% to 85%+:**\n\n1. **Highest impact** — Add test for `handleExpiredTokens` (L24)\n   → +8% overall, +15% branch\n\n2. **Second priority** — Complete `rejectInvalidFormats` (L31)\n   → +7% overall, +12% branch\n\n3. **Cleanup** — Add error branch to `refreshSession` (L43)\n   → +4% overall, +8% branch\n\nAll three can be done by implementing the test stubs that are already written in the file.',
};

export const vscodeSuggestedPrompts = [
  'What is the overall coverage?',
  'Which functions are uncovered?',
  'Add a test for the missing coverage',
  'Show branch coverage details',
];
