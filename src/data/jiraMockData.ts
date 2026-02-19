import type { JiraIssue } from '../types';

export const jiraIssue: JiraIssue = {
  key: 'QA-847',
  summary: '2FA validation endpoint returning 500 for valid codes in Sprint 23 regression',
  type: 'Bug',
  status: 'In Progress',
  priority: 'High',
  reporter: 'Ordino Bot',
  assignee: 'Unassigned',
  labels: ['regression', 'auth', '2fa', 'sprint-23'],
  sprint: 'Sprint 23',
  storyPoints: 5,
  description: `**Problem Statement**
The 2FA validation endpoint (\`POST /api/auth/validate-2fa\`) is returning HTTP 500 Internal Server Error for valid 6-digit TOTP codes during the Sprint 23 regression suite.

**Reproduction Steps**
1. Authenticate as a user with 2FA enabled
2. Generate a valid TOTP code using the registered authenticator
3. POST to \`/api/auth/validate-2fa\` with the valid code
4. Observe 500 response instead of expected 200

**Environment**
- Branch: \`feature/2fa-v2\` (commit \`a3f8c2d\`)
- Test environment: CI staging
- First seen: Build #4821, 2024-01-19 10:38 AM

**Impact**
All users with 2FA enabled cannot authenticate. Affects ~23% of the user base.`,
  comments: [
    {
      id: 'comment-1',
      authorName: 'Ordino Bot',
      authorType: 'bot',
      content: `**RCA Report — Confidence: 94%**

**Root Cause**
Null pointer dereference in \`AuthService.validate2FACode()\` at **line 247**.

The 2FA refactor in commit \`a3f8c2d\` updated \`TwoFactorFormatParser.parse()\` to return \`null\` for invalid inputs instead of throwing an exception. The calling method \`validate2FACode()\` does not handle a null return value, causing an unhandled \`NullPointerException\` that surfaces as a 500.

**Contributing Factors**
• No null check at the service boundary (line 247)
• Format parser contract changed without updating callers
• Test coverage for null/undefined inputs was not added

**Suggested Fix**
1. Add null guard in \`AuthService.validate2FACode()\` line 247:
   \`if (code == null) throw new InvalidTwoFactorCodeException("Code must not be null")\`
2. Update \`TwoFactorFormatParser.parse()\` to throw \`InvalidFormatException\` instead of returning null
3. Add unit tests in AT-203 for null/undefined/empty code inputs

**Affected Tests:** TC-002 (QA-848), TC-005 (QA-849)`,
      timestamp: '10:43 AM',
    },
  ],
  childIssues: [
    {
      key: 'QA-848',
      summary: 'TC-002: Validate 2FA code — null input handling',
      status: 'Open',
      type: 'Test',
    },
    {
      key: 'QA-849',
      summary: 'TC-005: Format parser edge cases — undefined/empty',
      status: 'Open',
      type: 'Test',
    },
  ],
};

export const jiraKeywordResponses: Record<string, string> = {
  'root cause|why|cause|what happened':
    'The root cause is a **null pointer dereference in `AuthService.validate2FACode()` at line 247**.\n\nCommit `a3f8c2d` changed `TwoFactorFormatParser.parse()` to return `null` for invalid inputs. The calling method has no null check, so a NullPointerException propagates up and becomes a 500 response.',

  'reproduce|steps|how to reproduce|repro':
    '**Reproduction Steps:**\n1. Set up a user account with 2FA enabled in the test environment\n2. Generate a valid TOTP code\n3. `POST /api/auth/validate-2fa` with body `{"code": "123456", "userId": "test-user"}`\n4. Observe: `500 Internal Server Error` (expected: `200 OK`)\n\nAlternatively, run `mvn test -Dtest=AuthServiceTest#test_2fa_validation_with_valid_code`',

  'fix|solution|how to fix|patch|suggestion':
    '**3-Step Fix:**\n\n1. **AuthService.java line 247** — Add null guard:\n```java\nif (code == null) {\n  throw new InvalidTwoFactorCodeException("Code must not be null");\n}\n```\n2. **TwoFactorFormatParser.java** — Change return-null to throw:\n```java\nthrow new InvalidFormatException("Expected 6-digit TOTP code");\n```\n3. **AuthServiceTest.java** — Add null input test cases\n\nFull diff will be in linked PR once fix is committed.',

  'related tests|linked tests|test cases|tc-002|tc-005':
    '**Related test cases:**\n\n• **TC-002** (QA-848) — `test_2fa_validation_with_valid_code`\n  Status: Failing | AT-112 in CI\n\n• **TC-005** (QA-849) — `test_2fa_format_parser_edge_cases`\n  Status: Failing | AT-203 in CI\n\nBoth are tracked as child issues on this ticket.',

  'priority|why high|severity|impact':
    '**Priority: High** — This is a production-impacting authentication failure.\n\n• ~23% of users have 2FA enabled\n• Those users **cannot log in** until this is fixed\n• It\'s a regression from the Sprint 23 2FA refactor\n• Not classified Critical because the fallback (SMS 2FA) still works\n\nTarget resolution: before Sprint 23 deployment window.',

  'impact|users affected|how many|who':
    '**Impact Analysis:**\n• Approximately **23% of the user base** has 2FA enabled\n• All affected users are completely blocked from authentication\n• The fallback authentication path (SMS code) remains functional\n• No data integrity risk — 500 errors on read-only validation\n• Estimated user impact duration: since Build #4821 (approx. 2 hours)\n\nJira ticket created automatically by Ordino at 10:43 AM.',
};

export const jiraSuggestedPrompts = [
  'What is the root cause?',
  'How do I reproduce this?',
  'Suggest a fix',
  'What is the user impact?',
];
