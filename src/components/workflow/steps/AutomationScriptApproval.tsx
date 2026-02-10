import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Code, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button, Badge } from '../../common';
import { automationScripts } from '../../../data/mockData';

interface AutomationScriptApprovalProps {
  onApprove?: () => void;
  onReject?: () => void;
}

export function AutomationScriptApproval({ onApprove, onReject }: AutomationScriptApprovalProps) {
  const readyScripts = automationScripts.filter(s => s.status === 'drafted');
  const blockedScripts = automationScripts.filter(s => s.status === 'waiting-for-info');
  const totalScripts = automationScripts.length;

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
              <h3 className="font-semibold text-ordino-text">Approve Drafted Automation Scripts</h3>
              <p className="text-sm text-ordino-text-muted">Review the drafted automation scripts before creating them in the repository</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
              <p className="text-2xl font-bold text-ordino-primary">{totalScripts}</p>
              <p className="text-xs text-ordino-text-muted">Total Scripts</p>
            </div>
            <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
              <p className="text-2xl font-bold text-ordino-success">{readyScripts.length}</p>
              <p className="text-xs text-ordino-text-muted">Ready to Create</p>
            </div>
            <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
              <p className="text-2xl font-bold text-ordino-warning">{blockedScripts.length}</p>
              <p className="text-xs text-ordino-text-muted">Blocked</p>
            </div>
          </div>

          {/* Ready Scripts */}
          {readyScripts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-ordino-success" />
                <h4 className="font-semibold text-ordino-text">Ready to Create</h4>
                <Badge variant="success" size="sm">{readyScripts.length}</Badge>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {readyScripts.map((script) => (
                  <div
                    key={script.id}
                    className="p-3 bg-ordino-success/10 rounded-lg border border-ordino-success/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Code size={14} className="text-ordino-success" />
                        <span className="text-sm font-mono text-ordino-primary">{script.id}</span>
                        <Badge variant="success" size="sm">{script.scriptType}</Badge>
                        <Badge variant="info" size="sm">{script.framework}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-ordino-text-muted">{script.testCaseTitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blocked Scripts */}
          {blockedScripts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-ordino-warning" />
                <h4 className="font-semibold text-ordino-text">Waiting for Information</h4>
                <Badge variant="warning" size="sm">{blockedScripts.length}</Badge>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {blockedScripts.map((script) => (
                  <div
                    key={script.id}
                    className="p-3 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Code size={14} className="text-ordino-warning" />
                        <span className="text-sm font-mono text-ordino-primary">{script.id}</span>
                        <Badge variant="warning" size="sm">{script.scriptType}</Badge>
                        <Badge variant="error" size="sm">Blocked</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-ordino-text-muted mb-1">{script.testCaseTitle}</p>
                    <p className="text-xs text-ordino-warning">{script.blockingReason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20 mb-6">
            <AlertCircle size={16} className="text-ordino-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-ordino-text-muted mb-1">
                Approving will create {readyScripts.length} automation script{readyScripts.length !== 1 ? 's' : ''} in the configured test script repository.
              </p>
              {blockedScripts.length > 0 && (
                <p className="text-xs text-ordino-warning">
                  Note: {blockedScripts.length} script{blockedScripts.length !== 1 ? 's' : ''} will be skipped until required information is available.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="danger" onClick={onReject} className="flex-1">
              <XCircle size={18} />
              Reject
            </Button>
            <Button variant="primary" onClick={onApprove} className="flex-1" disabled={readyScripts.length === 0}>
              <CheckCircle size={18} />
              Approve
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
