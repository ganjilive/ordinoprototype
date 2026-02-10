import { motion } from 'framer-motion';
import { CheckCircle, ListOrdered, Target, Database, AlertCircle } from 'lucide-react';
import { Badge } from '../../common';

interface TestStep {
  stepNumber: number;
  action: string;
  expectedResult: string;
}

interface TestCaseDetailProps {
  testCase: {
    id: string;
    title: string;
    description: string;
    testObjective?: string;
    preconditions?: string[];
    testSteps?: TestStep[];
    postconditions?: string[];
    testData?: {
      required?: string[];
      setup?: string;
    };
    testingMethod: string;
    priority: string;
    requirementId?: string;
  };
}

export function TestCaseDetail({ testCase }: TestCaseDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 bg-ordino-card rounded-lg border border-ordino-border"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-ordino-text">{testCase.title}</h4>
            <Badge
              variant={
                testCase.testingMethod === 'automation'
                  ? 'success'
                  : testCase.testingMethod === 'smoke'
                  ? 'warning'
                  : 'default'
              }
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
          <p className="text-xs text-ordino-text-muted mb-3">{testCase.description}</p>
        </div>
      </div>

      {/* Test Objective */}
      {testCase.testObjective && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-ordino-primary" />
            <span className="text-xs font-medium text-ordino-text">Test Objective</span>
          </div>
          <p className="text-xs text-ordino-text-muted ml-6">{testCase.testObjective}</p>
        </div>
      )}

      {/* Preconditions */}
      {testCase.preconditions && testCase.preconditions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-ordino-success" />
            <span className="text-xs font-medium text-ordino-text">Preconditions</span>
          </div>
          <ul className="space-y-1 ml-6">
            {testCase.preconditions.map((precondition, index) => (
              <li key={index} className="text-xs text-ordino-text-muted flex items-start gap-2">
                <span className="text-ordino-success mt-0.5">•</span>
                <span>{precondition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Test Steps */}
      {testCase.testSteps && testCase.testSteps.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ListOrdered size={14} className="text-ordino-primary" />
            <span className="text-xs font-medium text-ordino-text">Test Steps</span>
          </div>
          <div className="space-y-2 ml-6">
            {testCase.testSteps.map((step) => (
              <div key={step.stepNumber} className="p-2 bg-ordino-bg rounded border border-ordino-border">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-xs font-semibold text-ordino-primary">
                    Step {step.stepNumber}:
                  </span>
                  <span className="text-xs text-ordino-text flex-1">{step.action}</span>
                </div>
                <div className="ml-6 mt-1">
                  <span className="text-xs font-medium text-ordino-text-muted">Expected: </span>
                  <span className="text-xs text-ordino-text-muted">{step.expectedResult}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Postconditions */}
      {testCase.postconditions && testCase.postconditions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-ordino-success" />
            <span className="text-xs font-medium text-ordino-text">Postconditions</span>
          </div>
          <ul className="space-y-1 ml-6">
            {testCase.postconditions.map((postcondition, index) => (
              <li key={index} className="text-xs text-ordino-text-muted flex items-start gap-2">
                <span className="text-ordino-success mt-0.5">•</span>
                <span>{postcondition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Test Data */}
      {testCase.testData && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-ordino-primary" />
            <span className="text-xs font-medium text-ordino-text">Test Data</span>
          </div>
          <div className="ml-6 space-y-2">
            {testCase.testData.required && testCase.testData.required.length > 0 && (
              <div>
                <span className="text-xs font-medium text-ordino-text-muted">Required: </span>
                <ul className="mt-1 space-y-1">
                  {testCase.testData.required.map((item, index) => (
                    <li key={index} className="text-xs text-ordino-text-muted flex items-start gap-2">
                      <span className="text-ordino-primary mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {testCase.testData.setup && (
              <div>
                <span className="text-xs font-medium text-ordino-text-muted">Setup: </span>
                <span className="text-xs text-ordino-text-muted">{testCase.testData.setup}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Requirement Traceability */}
      {testCase.requirementId && (
        <div className="pt-2 border-t border-ordino-border">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-ordino-text-muted" />
            <span className="text-xs text-ordino-text-muted">
              Requirement: <span className="font-medium text-ordino-text">{testCase.requirementId}</span>
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
