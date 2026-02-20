import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button, Card } from '../../../common';

interface TestCasesApprovalProps {
  onApprove: () => void;
}

export function TestCasesApproval({ onApprove }: TestCasesApprovalProps) {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <h3 className="text-lg font-semibold text-ordino-text mb-4">
          Generated Test Cases Summary
        </h3>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-ordino-bg rounded-lg">
            <p className="text-2xl font-bold text-ordino-primary">24</p>
            <p className="text-sm text-ordino-text-muted">Total Test Cases</p>
          </div>
          <div className="text-center p-4 bg-ordino-bg rounded-lg">
            <p className="text-2xl font-bold text-ordino-success">18</p>
            <p className="text-sm text-ordino-text-muted">Automate</p>
          </div>
          <div className="text-center p-4 bg-ordino-bg rounded-lg">
            <p className="text-2xl font-bold text-ordino-warning">6</p>
            <p className="text-sm text-ordino-text-muted">Manual</p>
          </div>
        </div>

        {/* Coverage Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-ordino-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ordino-text">Complete Coverage</p>
              <p className="text-xs text-ordino-text-muted">
                All acceptance criteria from ORD-1234 are covered
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-ordino-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ordino-text">Traceability Established</p>
              <p className="text-xs text-ordino-text-muted">
                All test cases linked to requirements in Jira
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-ordino-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-ordino-text">Execution Strategy Labeled</p>
              <p className="text-xs text-ordino-text-muted">
                Each test case tagged with execution strategy (automate/manual/smoke)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Approval Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-ordino-primary/10 to-ordino-success/5 rounded-xl border border-ordino-primary/30 p-6"
      >
        <div className="text-center mb-4">
          <CheckCircle size={48} className="text-ordino-success mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-ordino-text mb-2">
            Test Cases Ready for Approval
          </h3>
          <p className="text-sm text-ordino-text-muted">
            24 test cases generated with execution strategy labels, linked to requirements, and ready for creation in test management tool.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="ghost" size="lg">
            Request Changes
          </Button>
          <Button onClick={onApprove} size="lg">
            <CheckCircle size={18} />
            Approve Test Cases
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
