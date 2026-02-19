import { useState } from 'react';
import { motion } from 'framer-motion';
import { jiraIssue, jiraKeywordResponses, jiraSuggestedPrompts } from '../../data/jiraMockData';
import { JiraHeader } from './jira/JiraHeader';
import { JiraFieldsSidebar } from './jira/JiraFieldsSidebar';
import { JiraActivitySection } from './jira/JiraActivitySection';
import { JiraCommentBox } from './jira/JiraCommentBox';
import type { JiraComment } from '../../types';

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const boldParts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = boldParts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="font-semibold text-ordino-text">{part}</strong> : part
    );
    const withCode = rendered.flatMap((node, j) => {
      if (typeof node !== 'string') return [node];
      const codeParts = node.split(/`([^`]+)`/g);
      return codeParts.map((part, k) =>
        k % 2 === 1
          ? <code key={`${j}-${k}`} className="font-mono text-xs bg-[#0d1117] px-1 py-0.5 rounded text-ordino-primary">{part}</code>
          : part
      );
    });
    return (
      <span key={i}>
        {withCode}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function JiraDemoComponent() {
  const [comments, setComments] = useState<JiraComment[]>(jiraIssue.comments);

  const handleAddComment = (comment: JiraComment) => {
    setComments((prev: JiraComment[]) => [...prev, comment]);
  };

  const issue = { ...jiraIssue, comments };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-[#161b27] rounded-xl border border-ordino-border overflow-hidden">
      {/* Jira top bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117] border-b border-ordino-border">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-[#0052CC] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">J</span>
          </div>
          <span className="text-sm font-semibold text-ordino-text">Jira Software</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ordino-primary/20 flex items-center justify-center text-xs text-ordino-primary font-bold">O</div>
          <span className="text-xs text-ordino-text-muted">Ordino Bot</span>
        </div>
      </div>

      {/* Breadcrumb + header */}
      <JiraHeader issueKey={issue.key} projectName="QA Project" issueType={issue.type} />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Detail panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Issue title */}
          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-ordino-text mb-6 leading-snug"
          >
            {issue.summary}
          </motion.h1>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-ordino-text mb-3">Description</h3>
            <div className="bg-ordino-bg border border-ordino-border rounded-lg p-4 text-sm text-ordino-text leading-relaxed">
              {parseMarkdown(issue.description)}
            </div>
          </div>

          {/* Activity (comments) */}
          <JiraActivitySection comments={issue.comments} />

          {/* Comment box */}
          <JiraCommentBox
            responses={jiraKeywordResponses}
            suggestedPrompts={jiraSuggestedPrompts}
            onAddComment={handleAddComment}
          />
        </div>

        {/* Fields sidebar */}
        <JiraFieldsSidebar issue={issue} />
      </div>
    </div>
  );
}
