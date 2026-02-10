import { motion } from 'framer-motion';
import { Link, CheckCircle, AlertCircle, Target } from 'lucide-react';
import { Badge } from '../../common';

interface TraceabilityMatrixProps {
  matrix: Array<{
    requirementId: string;
    requirementTitle: string;
    testCases: string[];
    coverage: string;
    coveragePercentage?: number;
    testObjectives?: string[];
  }>;
  testCases: Array<{
    id: string;
    title: string;
    testingMethod: string;
    priority: string;
  }>;
}

export function TraceabilityMatrix({ matrix, testCases }: TraceabilityMatrixProps) {
  const getTestCaseById = (id: string) => {
    return testCases.find(tc => tc.id === id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Link size={18} className="text-ordino-primary" />
        <h4 className="font-semibold text-ordino-text">Requirements Traceability Matrix</h4>
        <Badge variant="info" size="sm">ISTQB Standard</Badge>
      </div>

      <div className="space-y-4">
        {matrix.map((item, index) => (
          <motion.div
            key={item.requirementId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-ordino-card rounded-lg border border-ordino-border p-4"
          >
            {/* Requirement Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-ordino-primary">{item.requirementId}</span>
                  <Badge
                    variant={item.coverage === 'complete' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {item.coverage === 'complete' ? 'Complete Coverage' : 'Partial Coverage'}
                  </Badge>
                  {item.coveragePercentage !== undefined && (
                    <Badge variant="info" size="sm">
                      {item.coveragePercentage}% Coverage
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-ordino-text mb-2">{item.requirementTitle}</p>
              </div>
            </div>

            {/* Test Objectives */}
            {item.testObjectives && item.testObjectives.length > 0 && (
              <div className="mb-3 p-2 bg-ordino-bg rounded border border-ordino-border">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} className="text-ordino-primary" />
                  <span className="text-xs font-medium text-ordino-text">Test Objectives</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {item.testObjectives.map((objective, idx) => (
                    <li key={idx} className="text-xs text-ordino-text-muted flex items-start gap-2">
                      <CheckCircle size={12} className="text-ordino-success mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Test Cases */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={14} className="text-ordino-success" />
                <span className="text-xs font-medium text-ordino-text">
                  Linked Test Cases ({item.testCases.length})
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {item.testCases.map((testCaseId) => {
                  const testCase = getTestCaseById(testCaseId);
                  if (!testCase) return null;

                  const methodColors = {
                    automation: 'success',
                    manual: 'info',
                    smoke: 'warning',
                  } as const;

                  return (
                    <div
                      key={testCaseId}
                      className="flex items-center gap-2 p-2 bg-ordino-bg rounded border border-ordino-border"
                    >
                      <span className="text-xs font-mono text-ordino-primary flex-shrink-0">
                        {testCaseId}
                      </span>
                      <span className="text-xs text-ordino-text flex-1">{testCase.title}</span>
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
                  );
                })}
              </div>
            </div>

            {/* Coverage Status */}
            <div className="mt-3 pt-3 border-t border-ordino-border">
              <div className="flex items-center gap-2">
                {item.coverage === 'complete' ? (
                  <>
                    <CheckCircle size={14} className="text-ordino-success" />
                    <span className="text-xs text-ordino-text-muted">
                      All acceptance criteria are covered by test cases
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} className="text-ordino-warning" />
                    <span className="text-xs text-ordino-text-muted">
                      Some acceptance criteria may need additional test coverage
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-ordino-info/10 rounded-lg border border-ordino-info/20">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-ordino-info flex-shrink-0 mt-0.5" />
          <div className="text-xs text-ordino-text-muted">
            <p className="font-medium text-ordino-text mb-1">Traceability Benefits:</p>
            <ul className="space-y-1 ml-4">
              <li>• Ensures all requirements are tested</li>
              <li>• Enables impact analysis when requirements change</li>
              <li>• Supports test coverage reporting</li>
              <li>• Facilitates requirement-to-test traceability</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
