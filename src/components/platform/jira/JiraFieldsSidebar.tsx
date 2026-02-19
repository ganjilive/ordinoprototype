import type { JiraIssue } from '../../../types';
import { cn } from '../../../utils/helpers';

interface JiraFieldsSidebarProps {
  issue: JiraIssue;
}

const priorityColors: Record<string, string> = {
  Critical: 'text-red-400',
  High: 'text-orange-400',
  Medium: 'text-yellow-400',
  Low: 'text-blue-400',
};

const statusColors: Record<string, string> = {
  'In Progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Open': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  'Done': 'bg-green-500/20 text-green-300 border-green-500/30',
  'To Do': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-2.5 border-b border-ordino-border last:border-0">
      <p className="text-xs text-ordino-text-muted mb-1">{label}</p>
      <div className="text-sm text-ordino-text">{children}</div>
    </div>
  );
}

export function JiraFieldsSidebar({ issue }: JiraFieldsSidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 border-l border-ordino-border bg-[#1a1f2e] p-4 overflow-y-auto">
      <h3 className="text-xs font-semibold text-ordino-text-muted uppercase tracking-wider mb-3">Details</h3>

      <Field label="Status">
        <span className={cn('inline-flex px-2 py-0.5 rounded text-xs border font-medium', statusColors[issue.status] || statusColors['Open'])}>
          {issue.status}
        </span>
      </Field>

      <Field label="Priority">
        <span className={cn('font-medium', priorityColors[issue.priority] || 'text-ordino-text')}>
          {issue.priority}
        </span>
      </Field>

      <Field label="Reporter">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-ordino-primary/30 flex items-center justify-center text-xs text-ordino-primary font-bold">
            O
          </div>
          <span>{issue.reporter}</span>
        </div>
      </Field>

      <Field label="Assignee">
        <span className="text-ordino-text-muted italic">{issue.assignee}</span>
      </Field>

      <Field label="Sprint">
        <span>{issue.sprint}</span>
      </Field>

      <Field label="Story Points">
        <span>{issue.storyPoints}</span>
      </Field>

      <Field label="Labels">
        <div className="flex flex-wrap gap-1 mt-1">
          {issue.labels.map(label => (
            <span
              key={label}
              className="px-2 py-0.5 text-xs bg-ordino-bg border border-ordino-border rounded text-ordino-text-muted"
            >
              {label}
            </span>
          ))}
        </div>
      </Field>

      {issue.childIssues.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-ordino-text-muted uppercase tracking-wider mb-2">Child Issues</h3>
          <div className="space-y-2">
            {issue.childIssues.map(child => (
              <div key={child.key} className="p-2 bg-ordino-bg rounded border border-ordino-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-ordino-secondary">{child.key}</span>
                  <span className="text-xs text-ordino-text-muted border border-ordino-border rounded px-1">{child.status}</span>
                </div>
                <p className="text-xs text-ordino-text leading-tight">{child.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
