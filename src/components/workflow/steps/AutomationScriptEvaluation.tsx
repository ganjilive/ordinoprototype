import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Monitor, Code, MessageSquare } from 'lucide-react';
import { Badge } from '../../common';
import { automationRequirements } from '../../../data/mockData';

export function AutomationScriptEvaluation() {
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [notificationSent, setNotificationSent] = useState(false);
  const [notificationResponse, setNotificationResponse] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvaluationProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 3;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (evaluationProgress >= 100 && !notificationSent) {
      setTimeout(() => {
        setNotificationSent(true);
        setTimeout(() => {
          setNotificationResponse('Figma design link provided: https://figma.com/file/abc123');
        }, 2000);
      }, 1000);
    }
  }, [evaluationProgress, notificationSent]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Code size={24} className="text-ordino-primary" />
          <h3 className="text-lg font-semibold text-ordino-text">Evaluating Automation Requirements</h3>
        </div>
        <p className="text-sm text-ordino-text-muted">
          Analyzing automation test cases to determine required information for script writing
        </p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="flex justify-between text-xs text-ordino-text-muted mb-2">
          <span>Evaluating Requirements</span>
          <span>{Math.min(evaluationProgress, 100)}%</span>
        </div>
        <div className="h-2 bg-ordino-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ordino-primary to-ordino-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${evaluationProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Automation Test Cases Analysis */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-6">
        <h4 className="font-semibold text-ordino-text mb-4">Automation Test Cases Analysis</h4>
        <div className="space-y-4">
          {automationRequirements.automationTestCases.map((testCase, index) => {
            const isReady = testCase.status === 'ready';
            const needsInfo = testCase.status === 'needs-ui-design';

            return (
              <motion.div
                key={testCase.testCaseId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`p-4 rounded-lg border ${
                  isReady
                    ? 'bg-ordino-success/10 border-ordino-success/20'
                    : needsInfo
                    ? 'bg-ordino-warning/10 border-ordino-warning/20'
                    : 'bg-ordino-card border-ordino-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-ordino-text">{testCase.testCaseTitle}</span>
                      {isReady && <Badge variant="success" size="sm">Ready</Badge>}
                      {needsInfo && <Badge variant="warning" size="sm">Needs Info</Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        {testCase.requiredInfo.uiDesignAccess ? (
                          <>
                            {testCase.status === 'ready' ? (
                              <CheckCircle size={12} className="text-ordino-success" />
                            ) : (
                              <XCircle size={12} className="text-ordino-warning" />
                            )}
                            <span className={testCase.status === 'ready' ? 'text-ordino-success' : 'text-ordino-warning'}>
                              UI Design
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="text-ordino-text-muted" />
                            <span className="text-ordino-text-muted">UI Design</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {testCase.requiredInfo.testEnvironmentAccess ? (
                          <>
                            {testCase.status === 'ready' ? (
                              <CheckCircle size={12} className="text-ordino-success" />
                            ) : (
                              <XCircle size={12} className="text-ordino-warning" />
                            )}
                            <span className={testCase.status === 'ready' ? 'text-ordino-success' : 'text-ordino-warning'}>
                              Test Environment
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle size={12} className="text-ordino-text-muted" />
                            <span className="text-ordino-text-muted">Test Environment</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Product Development Stage */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-6">
        <h4 className="font-semibold text-ordino-text mb-3">Product Development Stage</h4>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">{automationRequirements.productDevelopmentStage}</Badge>
          <span className="text-sm text-ordino-text-muted">
            Script writing depends on available resources at this stage
          </span>
        </div>
      </div>

      {/* UX Designer Notification */}
      {evaluationProgress >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-6"
        >
          <h4 className="font-semibold text-ordino-text mb-4">UX Designer Notification</h4>
          
          <div className="space-y-4">
            {/* Notification Status */}
            <div className="flex items-center gap-3 p-3 bg-ordino-card rounded-lg">
              <MessageSquare size={20} className="text-ordino-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-ordino-text">Notification Sent</span>
                  {notificationSent && <CheckCircle size={16} className="text-ordino-success" />}
                </div>
                <div className="text-xs text-ordino-text-muted">
                  To: {automationRequirements.uxDesignerContact.name} ({automationRequirements.uxDesignerContact.email})
                </div>
                <div className="text-xs text-ordino-text-muted mt-1">
                  Requesting Figma design file link and test environment status
                </div>
              </div>
            </div>

            {/* Response */}
            {notificationResponse && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-ordino-success/10 rounded-lg border border-ordino-success/20"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-ordino-success flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ordino-success mb-1">Response Received</p>
                    <p className="text-xs text-ordino-text-muted">{notificationResponse}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Test Environment Check */}
            <div className="p-3 bg-ordino-card rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Monitor size={16} className="text-ordino-text-muted" />
                <span className="text-sm font-medium text-ordino-text">Test Environment Status</span>
              </div>
              <div className="flex items-center gap-2">
                {automationRequirements.testEnvironmentStatus === 'available' ? (
                  <>
                    <CheckCircle size={14} className="text-ordino-success" />
                    <span className="text-xs text-ordino-success">Available</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-ordino-warning" />
                    <span className="text-xs text-ordino-warning">Not Available</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Information Availability Matrix */}
      {evaluationProgress >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-6"
        >
          <h4 className="font-semibold text-ordino-text mb-4">Information Availability</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-ordino-success/10 rounded-lg border border-ordino-success/20">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={14} className="text-ordino-success" />
                <span className="text-sm font-medium text-ordino-text">Available</span>
              </div>
              <ul className="text-xs text-ordino-text-muted space-y-1 mt-2">
                <li>• API Documentation</li>
                <li>• Database Schema</li>
                {notificationResponse && <li>• Figma Design Link</li>}
              </ul>
            </div>
            <div className="p-3 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={14} className="text-ordino-warning" />
                <span className="text-sm font-medium text-ordino-text">Needed</span>
              </div>
              <ul className="text-xs text-ordino-text-muted space-y-1 mt-2">
                {automationRequirements.testEnvironmentStatus === 'not-available' && (
                  <li>• Test Environment Access</li>
                )}
                {!notificationResponse && <li>• Figma Design with Locators</li>}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
