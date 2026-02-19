import type { SlackCIAlertData, SlackChannelMessage } from '../types';

export const slackCIAlertData: SlackCIAlertData = {
  buildNumber: 4821,
  commitHash: 'a3f8c2d',
  commitAuthor: 'sarah.chen',
  branch: 'feature/2fa-v2',
  failingTests: [
    {
      id: 'AT-112',
      name: 'test_2fa_validation_with_valid_code',
      error: 'Expected 200 OK, got 500 Internal Server Error',
    },
    {
      id: 'AT-089',
      name: 'test_auth_service_token_refresh',
      error: 'NullPointerException in AuthService.validate2FACode():247',
    },
    {
      id: 'AT-203',
      name: 'test_2fa_format_parser_edge_cases',
      error: "Invalid format: expected 6-digit code, got 'undefined'",
    },
  ],
  coverageBefore: 74.8,
  coverageAfter: 71.2,
  jiraTicket: 'QA-847',
};

export const slackInitialMessages: SlackChannelMessage[] = [
  {
    id: 'msg-1',
    authorName: 'Ordino Bot',
    authorType: 'bot',
    content: '',
    timestamp: '10:42 AM',
    isAlert: true,
  },
  {
    id: 'msg-2',
    authorName: 'Ordino Bot',
    authorType: 'bot',
    content:
      'Failure appears related to the auth service refactor in commit a3f8c2d. The 2FA validation endpoint is throwing a NullPointerException on line 247 of AuthService. Performing RCA now...',
    timestamp: '10:42 AM',
  },
  {
    id: 'msg-3',
    authorName: 'Ordino',
    authorType: 'system',
    content: 'Ordino has opened Jira ticket QA-847 and assigned to the auth team.',
    timestamp: '10:43 AM',
  },
];

export const slackKeywordResponses: Record<string, string> = {
  'failure|failing|failed|fail':
    '**3 failing tests in Build #4821:**\n• AT-112: `test_2fa_validation_with_valid_code` — 500 on valid code\n• AT-089: `test_auth_service_token_refresh` — NullPointerException line 247\n• AT-203: `test_2fa_format_parser_edge_cases` — format parser returning undefined\n\nAll 3 are in the auth service and related to the 2FA refactor.',

  'root cause|why|cause':
    "**Root Cause:** Null pointer dereference in `AuthService.validate2FACode()` at line 247.\n\nCommit `a3f8c2d` by sarah.chen refactored the auth service but introduced a missing null check on the token input parameter. When the 2FA format parser encounters edge cases, it returns `null` instead of throwing — which the validation method doesn't handle.",

  'fix|solution|resolve|patch':
    '**Suggested Fix (3 steps):**\n1. Add null check in `AuthService.validate2FACode()` at line 247: `if (code == null) throw new InvalidCodeException()`\n2. Update `TwoFactorFormatParser.parse()` to throw instead of returning null on invalid input\n3. Add test coverage for null/undefined inputs in AT-203\n\nEstimated fix time: 30–45 min. Ticket QA-847 has full details.',

  'rerun|re-run|retry':
    "**Rerun guidance:** Don't rerun yet — the failures are deterministic, not flaky. The null pointer will reproduce 100% of the time on the current code. Fix the null check in `AuthService` first, then rerun. After the fix, AT-112 and AT-089 should pass. AT-203 may need the format parser fix too.",

  'coverage|delta|percent':
    '**Coverage drop: 74.8% → 71.2% (−3.6%)**\n\nThe refactored auth service paths (2FA validation branch, error handling) are not covered by existing tests. The 3 failing tests were the main coverage contributors for those paths. Fixing and re-enabling them will recover ~2.8% of the drop.',

  'commit|who|author|sarah':
    '**Commit a3f8c2d** by sarah.chen on branch `feature/2fa-v2`\n• Pushed: Today 10:38 AM\n• Message: "refactor: Rewrite auth service 2FA validation for Sprint 23"\n• Files changed: `AuthService.java`, `TwoFactorFormatParser.java`, `AuthServiceTest.java`\n\nJira ticket QA-847 has been auto-linked to this commit.',
};

export const slackSuggestedPrompts = [
  'What tests are failing?',
  'What is the root cause?',
  'How do I fix this?',
  'Show coverage impact',
];
