import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Code, AlertTriangle } from 'lucide-react';
import { Badge } from '../../common';
import { automationScripts } from '../../../data/mockData';

export function AutomationScriptDrafting() {
  const [draftedScripts, setDraftedScripts] = useState<string[]>([]);
  const [visibleScripts, setVisibleScripts] = useState(0);

  useEffect(() => {
    // Simulate drafting scripts one by one
    automationScripts.forEach((script, index) => {
      if (script.status === 'drafted') {
        setTimeout(() => {
          setDraftedScripts((prev) => [...prev, script.id]);
          setVisibleScripts((prev) => prev + 1);
        }, (index + 1) * 1500);
      }
    });
  }, []);

  const readyScripts = automationScripts.filter(s => s.status === 'drafted');
  const blockedScripts = automationScripts.filter(s => s.status === 'waiting-for-info');
  const allDrafted = draftedScripts.length === readyScripts.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(249, 115, 22, 0.4)',
              '0 0 20px 10px rgba(249, 115, 22, 0)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Code size={32} className="text-ordino-primary" />
          </motion.div>
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">Drafting Test Automation Scripts</h3>
        <p className="text-sm text-ordino-text-muted">
          Creating automation scripts based on available information
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
          <p className="text-2xl font-bold text-ordino-success">{readyScripts.length}</p>
          <p className="text-xs text-ordino-text-muted">Ready to Draft</p>
        </div>
        <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
          <p className="text-2xl font-bold text-ordino-primary">{draftedScripts.length}</p>
          <p className="text-xs text-ordino-text-muted">Drafted</p>
        </div>
        <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
          <p className="text-2xl font-bold text-ordino-warning">{blockedScripts.length}</p>
          <p className="text-xs text-ordino-text-muted">Blocked</p>
        </div>
      </div>

      {/* Drafting Scripts */}
      <div className="space-y-4">
        <h4 className="font-semibold text-ordino-text">Automation Scripts</h4>
        
        {/* Ready Scripts Being Drafted */}
        <div className="space-y-3">
          {readyScripts.map((script, index) => {
            const isDrafted = draftedScripts.includes(script.id);
            const isVisible = index < visibleScripts;

            return (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  height: isVisible ? 'auto' : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4">
                  <div className="flex items-center gap-4">
                    {/* Script Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isDrafted ? 'bg-ordino-success/20' : 'bg-ordino-card'
                    }`}>
                      {isDrafted ? (
                        <CheckCircle size={24} className="text-ordino-success" />
                      ) : (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 size={24} className="text-ordino-primary" />
                        </motion.div>
                      )}
                    </div>

                    {/* Script Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-ordino-text">{script.id}</span>
                          <Badge variant="success" size="sm">{script.scriptType}</Badge>
                          <Badge variant="info" size="sm">{script.framework}</Badge>
                        </div>
                        {isDrafted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                          >
                            <Badge variant="success" size="sm">Drafted</Badge>
                          </motion.div>
                        )}
                      </div>
                      <p className="text-sm text-ordino-text-muted mb-2">
                        {script.testCaseTitle}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-ordino-text-muted">
                        <div className="flex items-center gap-1">
                          <CheckCircle size={12} className="text-ordino-success" />
                          <span>UI Design: {script.requiredInfoStatus.uiDesignAccess}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle size={12} className="text-ordino-success" />
                          <span>Test Env: {script.requiredInfoStatus.testEnvironmentAccess}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Blocked Scripts */}
        {blockedScripts.length > 0 && (
          <div className="space-y-3 mt-6">
            <h5 className="text-sm font-medium text-ordino-text">Waiting for Information</h5>
            {blockedScripts.map((script) => (
              <div
                key={script.id}
                className="bg-ordino-bg rounded-xl border border-ordino-warning/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-ordino-warning/20 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-ordino-warning" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-ordino-text">{script.id}</span>
                      <Badge variant="warning" size="sm">{script.scriptType}</Badge>
                      <Badge variant="error" size="sm">Blocked</Badge>
                    </div>
                    <p className="text-sm text-ordino-text-muted mb-2">
                      {script.testCaseTitle}
                    </p>
                    <div className="text-xs text-ordino-warning">
                      {script.blockingReason}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-ordino-text-muted">
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={12} className="text-ordino-warning" />
                        <span>UI Design: {script.requiredInfoStatus.uiDesignAccess}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={12} className="text-ordino-warning" />
                        <span>Test Env: {script.requiredInfoStatus.testEnvironmentAccess}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completion Summary */}
      {allDrafted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-md mx-auto"
        >
          <CheckCircle size={32} className="text-ordino-success mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-ordino-success mb-2">Scripts Drafted!</h4>
          <div className="text-sm text-ordino-text-muted space-y-1">
            <div>{draftedScripts.length} automation scripts successfully drafted</div>
            {blockedScripts.length > 0 && (
              <div className="text-ordino-warning mt-2">
                {blockedScripts.length} script(s) waiting for additional information
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
