export function matchResponse(input: string, responses: Record<string, string>): string {
  const lower = input.toLowerCase();
  for (const [pattern, response] of Object.entries(responses)) {
    const keywords = pattern.split('|');
    if (keywords.some(kw => lower.includes(kw.trim()))) {
      return response;
    }
  }
  return "I don't have specific information about that in this demo. Try asking about the relevant scenario, failures, root cause, coverage, or how to fix the issue.";
}
