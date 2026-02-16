import { motion } from 'framer-motion';
import { CheckCircle, XCircle, GitCommit, FileText, FilePlus, FileEdit, User } from 'lucide-react';
import { Button, Badge } from '../../../common';
import { commitDetails } from '../../../../data/testExecutionMockData';

interface CommitScriptsProps {
  onApprove: () => void;
  onReject: () => void;
}

export function CommitScripts({ onApprove, onReject }: CommitScriptsProps) {
  const getFileStatusIcon = (status: string) => {
    switch (status) {
      case 'added':
        return <FilePlus size={14} className="text-ordino-success" />;
      case 'modified':
        return <FileEdit size={14} className="text-ordino-warning" />;
      case 'deleted':
        return <XCircle size={14} className="text-ordino-error" />;
      default:
        return <FileText size={14} className="text-ordino-text-muted" />;
    }
  };

  const getFileStatusBadge = (status: string) => {
    switch (status) {
      case 'added':
        return <Badge variant="success" size="sm">Added</Badge>;
      case 'modified':
        return <Badge variant="warning" size="sm">Modified</Badge>;
      case 'deleted':
        return <Badge variant="error" size="sm">Deleted</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Commit Test Results</h3>
          <p className="text-sm text-ordino-text-muted">
            Review and approve changes before committing to repository
          </p>
        </div>
        <Badge variant="warning">Approval Required</Badge>
      </div>

      {/* Commit Info */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-ordino-primary/20 flex items-center justify-center">
            <GitCommit size={24} className="text-ordino-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-sm text-ordino-primary">{commitDetails.hash}</span>
              <Badge variant="info" size="sm">{commitDetails.branch}</Badge>
            </div>
            <p className="text-ordino-text font-medium mb-2">{commitDetails.message}</p>
            <div className="flex items-center gap-4 text-xs text-ordino-text-muted">
              <span className="flex items-center gap-1">
                <User size={12} />
                {commitDetails.author}
              </span>
              <span className="text-ordino-success">+{commitDetails.additions}</span>
              <span className="text-ordino-error">-{commitDetails.deletions}</span>
              <span>{commitDetails.filesChanged} files</span>
            </div>
          </div>
        </div>
      </div>

      {/* Changed Files */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4">
        <h4 className="font-semibold text-ordino-text mb-4">Changed Files</h4>
        <div className="space-y-2">
          {commitDetails.changedFiles.map((file, index) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-ordino-card rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getFileStatusIcon(file.status)}
                <span className="text-sm font-mono text-ordino-text">{file.name}</span>
              </div>
              {getFileStatusBadge(file.status)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Diff Preview */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4">
        <h4 className="font-semibold text-ordino-text mb-4">Diff Preview</h4>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <div className="text-gray-500 mb-2">--- a/test-results/ORD-1234-results.xml</div>
          <div className="text-gray-500 mb-2">+++ b/test-results/ORD-1234-results.xml</div>
          <div className="text-gray-500">@@ -0,0 +1,45 @@</div>
          <div className="text-ordino-success">+ &lt;?xml version="1.0" encoding="UTF-8"?&gt;</div>
          <div className="text-ordino-success">+ &lt;testsuite name="2FA Feature Tests"&gt;</div>
          <div className="text-ordino-success">+   &lt;testcase name="TwoFactorSetupTest" status="passed"/&gt;</div>
          <div className="text-ordino-success">+   &lt;testcase name="TwoFactorValidationTest" status="passed"/&gt;</div>
          <div className="text-ordino-success">+   &lt;testcase name="InvalidCodeTest" status="failed"&gt;</div>
          <div className="text-ordino-success">+     &lt;failure&gt;AssertionError&lt;/failure&gt;</div>
          <div className="text-ordino-success">+   &lt;/testcase&gt;</div>
          <div className="text-ordino-success">+   &lt;!-- ... more test results ... --&gt;</div>
          <div className="text-ordino-success">+ &lt;/testsuite&gt;</div>
        </div>
      </div>

      {/* Commit Message Preview */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4">
        <h4 className="font-semibold text-ordino-text mb-3">Commit Message</h4>
        <div className="bg-ordino-card rounded-lg p-3 border border-ordino-border">
          <p className="text-sm text-ordino-text font-mono whitespace-pre-wrap">
{`${commitDetails.message}

- Added test execution results for 15 test cases
- 12 passed, 3 failed, 1 skipped
- Created 3 bug tickets: ORD-1501, ORD-1502, ORD-1503
- Updated coverage report

Co-Authored-By: Ordino AI <ai@ordino.io>`}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-end gap-3 pt-4 border-t border-ordino-border"
      >
        <p className="text-xs text-ordino-text-muted mr-auto">
          Approve to commit changes to the repository
        </p>
        <Button variant="ghost" onClick={onReject} size="sm">
          <XCircle size={16} />
          Reject
        </Button>
        <Button onClick={onApprove} size="sm">
          <CheckCircle size={16} />
          Approve & Commit
        </Button>
      </motion.div>
    </motion.div>
  );
}
