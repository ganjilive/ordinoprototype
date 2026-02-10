import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, FileText, GitBranch, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Badge } from '../../common';
import { testDesign, draftedTestCases } from '../../../data/mockData';
import { TestCaseDetail } from './TestCaseDetail';

interface DraftedTestDesignReviewProps {
  onApprove?: () => void;
  onReject?: () => void;
}

export function DraftedTestDesignReview({ onApprove, onReject }: DraftedTestDesignReviewProps) {
  const [expandedTestCases, setExpandedTestCases] = useState<Set<string>>(new Set());
  const affectedPaths = testDesign.paths.filter(p => p.status === 'affected');
  const testCasesByMethod = {
    automation: draftedTestCases.filter(tc => tc.testingMethod === 'automation').length,
    manual: draftedTestCases.filter(tc => tc.testingMethod === 'manual').length,
    smoke: draftedTestCases.filter(tc => tc.testingMethod === 'smoke').length,
  };

  const toggleTestCase = (testCaseId: string) => {
    const newSet = new Set(expandedTestCases);
    if (newSet.has(testCaseId)) {
      newSet.delete(testCaseId);
    } else {
      newSet.add(testCaseId);
    }
    setExpandedTestCases(newSet);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden">
        <div className="bg-ordino-card px-6 py-4 border-b border-ordino-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ordino-warning/20 flex items-center justify-center">
              <Clock size={20} className="text-ordino-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-ordino-text">Review Drafted Test Design & Test Cases</h3>
              <p className="text-sm text-ordino-text-muted">Please review the drafted updates before approval</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
              <p className="text-2xl font-bold text-ordino-primary">{affectedPaths.length}</p>
              <p className="text-xs text-ordino-text-muted">Affected Paths</p>
            </div>
            <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
              <p className="text-2xl font-bold text-ordino-success">{draftedTestCases.length}</p>
              <p className="text-xs text-ordino-text-muted">New Test Cases</p>
            </div>
            <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
              <p className="text-2xl font-bold text-ordino-secondary">v{testDesign.version}</p>
              <p className="text-xs text-ordino-text-muted">New Design Version</p>
            </div>
          </div>

          {/* Drafted Test Design Changes */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch size={18} className="text-ordino-primary" />
              <h4 className="font-semibold text-ordino-text">Drafted Test Design Changes</h4>
            </div>
            <div className="space-y-2">
              {affectedPaths.map((path) => (
                <div
                  key={path.id}
                  className="p-3 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-ordino-text">{path.name}</span>
                    <Badge variant="warning" size="sm">Updated</Badge>
                  </div>
                  <p className="text-xs text-ordino-text-muted">{path.description}</p>
                  <p className="text-xs text-ordino-warning mt-1">{path.affectedReason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Drafted Test Cases */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-ordino-primary" />
              <h4 className="font-semibold text-ordino-text">Drafted Test Cases</h4>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {draftedTestCases.map((testCase) => {
                const methodColors = {
                  automation: 'success',
                  manual: 'info',
                  smoke: 'warning',
                } as const;
                const isExpanded = expandedTestCases.has(testCase.id);

                return (
                  <div
                    key={testCase.id}
                    className="bg-ordino-card rounded-lg border border-ordino-border overflow-hidden"
                  >
                    <button
                      onClick={() => toggleTestCase(testCase.id)}
                      className="w-full p-3 flex items-center justify-between hover:bg-ordino-bg transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <span className="text-xs font-mono text-ordino-primary">{testCase.id}</span>
                        <p className="text-xs text-ordino-text flex-1">{testCase.title}</p>
                        <Badge
                          variant={methodColors[testCase.testingMethod as keyof typeof methodColors] || 'default'}
                          size="sm"
                        >
                          {testCase.testingMethod}
                        </Badge>
                        <Badge
                          variant={testCase.priority === 'High' ? 'error' : 'default'}
                          size="sm"
                        >
                          {testCase.priority}
                        </Badge>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-ordino-text-muted ml-2" />
                      ) : (
                        <ChevronDown size={16} className="text-ordino-text-muted ml-2" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 pt-0 border-t border-ordino-border">
                            <TestCaseDetail testCase={testCase} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-ordino-success/10 rounded">
                <span className="font-medium text-ordino-success">{testCasesByMethod.automation}</span>
                <span className="text-ordino-text-muted ml-1">Automation</span>
              </div>
              <div className="text-center p-2 bg-ordino-info/10 rounded">
                <span className="font-medium text-ordino-info">{testCasesByMethod.manual}</span>
                <span className="text-ordino-text-muted ml-1">Manual</span>
              </div>
              <div className="text-center p-2 bg-ordino-warning/10 rounded">
                <span className="font-medium text-ordino-warning">{testCasesByMethod.smoke}</span>
                <span className="text-ordino-text-muted ml-1">Smoke</span>
              </div>
            </div>
          </div>

          {/* Reviewer Info */}
          <div className="mb-6 p-3 bg-ordino-card rounded-lg border border-ordino-border">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-ordino-text-muted" />
              <span className="text-sm font-medium text-ordino-text">Reviewers</span>
            </div>
            <div className="text-xs text-ordino-text-muted space-y-1">
              <div>• QA Lead - Test Design Review</div>
              <div>• Test Manager - Test Cases Approval</div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20 mb-6">
            <AlertCircle size={16} className="text-ordino-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-ordino-text-muted">
              Approving will create a new version of the test design and add the new test cases to the test repository.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="danger" onClick={onReject} className="flex-1">
              <XCircle size={18} />
              Reject
            </Button>
            <Button variant="primary" onClick={onApprove} className="flex-1">
              <CheckCircle size={18} />
              Approve
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
