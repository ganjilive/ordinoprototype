import { AlertTriangle, GitCommit, ExternalLink } from 'lucide-react';
import type { SlackCIAlertData } from '../../../types';

interface SlackCIAlertCardProps {
  data: SlackCIAlertData;
}

export function SlackCIAlertCard({ data }: SlackCIAlertCardProps) {
  const coverageDelta = (data.coverageAfter - data.coverageBefore).toFixed(1);

  return (
    <div className="bg-[#1a1f2e] border border-ordino-border rounded-lg overflow-hidden max-w-lg">
      {/* Red left bar (Slack block-kit style) */}
      <div className="flex">
        <div className="w-1 bg-red-500 flex-shrink-0" />
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-400">Build #{data.buildNumber} FAILED</p>
              <p className="text-xs text-ordino-text-muted mt-0.5">CI/CD Pipeline · GitHub Actions</p>
            </div>
          </div>

          {/* Commit info */}
          <div className="flex items-center gap-2 mb-3 p-2 bg-ordino-bg rounded border border-ordino-border">
            <GitCommit size={14} className="text-ordino-text-muted flex-shrink-0" />
            <code className="text-xs text-ordino-primary font-mono">{data.commitHash}</code>
            <span className="text-xs text-ordino-text-muted">by</span>
            <span className="text-xs font-medium text-ordino-text">{data.commitAuthor}</span>
            <span className="text-xs text-ordino-text-muted">on</span>
            <code className="text-xs text-ordino-secondary font-mono truncate">{data.branch}</code>
          </div>

          {/* Failing tests */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-ordino-text-muted mb-2">
              {data.failingTests.length} FAILING TESTS
            </p>
            <div className="space-y-1.5">
              {data.failingTests.map(test => (
                <div key={test.id} className="flex items-start gap-2">
                  <span className="text-xs font-medium text-ordino-primary flex-shrink-0 mt-0.5">{test.id}</span>
                  <div>
                    <p className="text-xs font-medium text-ordino-text">{test.name}</p>
                    <p className="text-xs text-red-400/80 font-mono">{test.error}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage delta */}
          <div className="flex items-center gap-4 pt-3 border-t border-ordino-border">
            <div>
              <p className="text-xs text-ordino-text-muted">Coverage</p>
              <p className="text-sm font-mono">
                <span className="text-ordino-text-muted">{data.coverageBefore}%</span>
                <span className="text-ordino-text-muted mx-1">→</span>
                <span className="text-ordino-error font-semibold">{data.coverageAfter}%</span>
                <span className="text-red-400 ml-1 text-xs">({coverageDelta}%)</span>
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-ordino-secondary hover:underline cursor-pointer">
              <span>View in Jira: {data.jiraTicket}</span>
              <ExternalLink size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
