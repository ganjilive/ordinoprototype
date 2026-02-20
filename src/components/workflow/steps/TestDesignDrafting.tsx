import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, GitBranch } from 'lucide-react';
import { Badge } from '../../common';
import { testDesign } from '../../../data/mockData';

export function TestDesignDrafting() {
  const [currentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setPhaseProgress((prev) => {
        if (prev >= 100) {
          // Only one phase (0), so mark it as completed when done
          setCompletedPhases((prev) => new Set(prev).add(currentPhase));
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [currentPhase]);

  // Phase 1: Draft Test Design (Scenarios, Paths, Conditions)
  const renderPhase1 = (isCompleted: boolean) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {isCompleted ? (
          <CheckCircle size={20} className="text-ordino-success" />
        ) : (
          <GitBranch size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Test Design Draft Complete' : 'Drafting test design (scenarios, paths, conditions)...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={20} className="text-ordino-primary" />
          <h3 className="text-lg font-semibold text-ordino-text">{testDesign.name}</h3>
          <Badge variant="info" size="sm">v{testDesign.version} (Draft)</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-ordino-text mb-2">Test Paths</h4>
            <div className="space-y-3">
              {testDesign.paths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={`p-4 rounded-lg border ${
                    path.status === 'affected'
                      ? 'bg-ordino-warning/10 border-ordino-warning/30'
                      : 'bg-ordino-card border-ordino-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-ordino-text">{path.name}</span>
                    <div className="flex items-center gap-2">
                      {path.status === 'affected' && (
                        <Badge variant="warning" size="sm">Modified</Badge>
                      )}
                      <Badge variant="primary" size="sm">Draft</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-ordino-text-muted">{path.description}</p>
                  {path.status === 'affected' && (
                    <p className="text-xs text-ordino-warning mt-2">{path.affectedReason}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* New 2FA Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-lg border bg-ordino-success/10 border-ordino-success/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-ordino-text">2FA Authentication Path</span>
              <Badge variant="success" size="sm">New</Badge>
            </div>
            <p className="text-sm text-ordino-text-muted">
              New path covering two-factor authentication flow with SMS/TOTP verification
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Phase 2: Draft Test Cases with Automation Feasibility
  // Determine which phases should be visible
  const shouldShowPhase = (phaseIndex: number) => {
    return phaseIndex === 0; // Only show phase 0
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Draft Test Design</h3>
          <p className="text-sm text-ordino-text-muted">
            Drafting test design with scenarios, paths, and edge conditions based on affected user flows
          </p>
        </div>
      </div>

      {/* Phase Progress Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-2 bg-ordino-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ordino-primary to-ordino-secondary"
            initial={{ width: '0%' }}
            animate={{ width: `${phaseProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="text-xs text-ordino-text-muted">
          Drafting test design...
        </span>
      </div>

      {/* Phase Content */}
      <div className="space-y-6">
        {/* Phase 1: Test Design Draft */}
        {shouldShowPhase(0) && (
          <div>
            {renderPhase1(completedPhases.has(0))}
          </div>
        )}
      </div>
    </div>
  );
}
