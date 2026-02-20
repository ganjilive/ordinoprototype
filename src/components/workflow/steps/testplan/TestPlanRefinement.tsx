import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileEdit, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '../../../common';

interface TestPlanRefinementProps {
  onContinue: () => void;
}

export function TestPlanRefinement({ onContinue }: TestPlanRefinementProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [refinedSections, setRefinedSections] = useState<string[]>([]);
  const mountedRef = useRef(true);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

    // Phase 0: Analyzing feedback (1.5s)
    if (currentPhase === 0) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setCompletedPhases([0]);
        setCurrentPhase(1);
      }, 1500);
    }

    // Phase 1: Refining sections one-by-one
    if (currentPhase === 1) {
      // Add sections progressively
      const sectionTimers = [
        { section: 'scope', delay: 800 },
        { section: 'approach', delay: 1600 },
        { section: 'environment', delay: 2400 },
        { section: 'criteria', delay: 3200 },
      ];

      sectionTimers.forEach(({ section, delay }) => {
        setTimeout(() => {
          if (!mountedRef.current) return;
          setRefinedSections(prev => [...prev, section]);
        }, delay);
      });

      // Move to phase 2 after all sections
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setCompletedPhases([0, 1]);
        setCurrentPhase(2);
      }, 4000);
    }

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [currentPhase]);

  const changes = [
    { id: 'scope', stakeholder: 'Sarah Chen', text: 'Added mobile app testing (iOS/Android)' },
    { id: 'approach', stakeholder: 'Michael Torres', text: 'Added security penetration testing & integration testing approach' },
    { id: 'environment', stakeholder: 'David Kim', text: 'Specified containerized test environment with Docker' },
    { id: 'criteria', stakeholder: 'Michael Torres', text: 'Set 80% code coverage threshold as exit criteria' },
  ];

  return (
    <div className="space-y-6">
      {/* Phase 0: Analyzing */}
      {currentPhase === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-card rounded-xl border border-ordino-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={20} className="text-ordino-primary" />
            </motion.div>
            <span className="text-lg font-semibold text-ordino-text">
              Analyzing stakeholder feedback...
            </span>
          </div>
          <p className="text-sm text-ordino-text-muted">
            Processing input from BA, QA Lead, and DevOps team to refine the test plan.
          </p>
        </motion.div>
      )}

      {/* Phase 1 & 2: Refinement in progress / complete */}
      {currentPhase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-card rounded-xl border border-ordino-border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-ordino-bg border-b border-ordino-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileEdit size={20} className="text-ordino-primary" />
              <h3 className="text-lg font-semibold text-ordino-text">Test Plan Refinement</h3>
            </div>
            {currentPhase === 2 && (
              <Badge variant="success" size="sm">Complete</Badge>
            )}
          </div>

          {/* Refined Changes */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-ordino-text-muted mb-4">
              Applying changes based on stakeholder feedback from the collaboration step:
            </p>

            {changes.map((change, index) => {
              const isRevealed = refinedSections.includes(change.id);

              return (
                <motion.div
                  key={change.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isRevealed ? 1 : 0.3,
                    x: 0,
                    scale: isRevealed ? 1 : 0.95
                  }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-ordino-bg rounded-lg border p-4 ${
                    isRevealed ? 'border-ordino-success' : 'border-ordino-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
                      <CheckCircle size={18} className="text-ordino-success" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-ordino-text capitalize">
                          {change.id === 'scope' && 'Scope of Testing'}
                          {change.id === 'approach' && 'Test Approach'}
                          {change.id === 'environment' && 'Test Environment'}
                          {change.id === 'criteria' && 'Entry/Exit Criteria'}
                        </span>
                        {isRevealed && <Badge variant="success" size="sm">Updated</Badge>}
                      </div>
                      <p className="text-xs text-ordino-text-muted mb-1">
                        <strong>Change:</strong> {change.text}
                      </p>
                      <p className="text-xs text-ordino-text-muted">
                        <strong>Source:</strong> {change.stakeholder}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Summary of Changes */}
      {completedPhases.includes(1) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-ordino-success/10 to-ordino-primary/5 rounded-xl border border-ordino-success/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle size={24} className="text-ordino-success" />
            <h3 className="text-lg font-semibold text-ordino-text">
              Test Plan Successfully Refined
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-ordino-bg/50 rounded-lg p-3">
              <p className="text-xs text-ordino-text-muted mb-1">Changes Applied</p>
              <p className="text-2xl font-bold text-ordino-primary">4</p>
            </div>
            <div className="bg-ordino-bg/50 rounded-lg p-3">
              <p className="text-xs text-ordino-text-muted mb-1">Stakeholders</p>
              <p className="text-2xl font-bold text-ordino-primary">3</p>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
              <span className="text-ordino-text">Mobile testing scope added for iOS/Android platforms</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
              <span className="text-ordino-text">Security penetration testing included in test approach</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
              <span className="text-ordino-text">Containerized test environment with Docker specified</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle size={16} className="text-ordino-success mt-0.5 flex-shrink-0" />
              <span className="text-ordino-text">80% code coverage threshold set as exit criteria</span>
            </li>
          </ul>

          <div className="flex justify-center">
            <button
              onClick={onContinue}
              className="px-6 py-3 bg-ordino-primary hover:bg-ordino-primary/90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              Continue to Approval
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
