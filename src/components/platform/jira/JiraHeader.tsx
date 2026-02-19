import { Bug, ChevronRight } from 'lucide-react';

interface JiraHeaderProps {
  issueKey: string;
  projectName: string;
  issueType: string;
}

export function JiraHeader({ issueKey, projectName, issueType }: JiraHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-ordino-border bg-[#1a1f2e] text-sm">
      {/* Breadcrumb */}
      <span className="text-ordino-text-muted hover:text-ordino-secondary cursor-pointer">{projectName}</span>
      <ChevronRight size={14} className="text-ordino-text-muted" />
      <span className="text-ordino-text-muted hover:text-ordino-secondary cursor-pointer">Board</span>
      <ChevronRight size={14} className="text-ordino-text-muted" />

      {/* Issue type + key */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
          <Bug size={12} className="text-white" />
        </div>
        <span className="text-ordino-text font-medium">{issueKey}</span>
      </div>

      <span className="ml-auto text-xs text-ordino-text-muted">{issueType}</span>
    </div>
  );
}
