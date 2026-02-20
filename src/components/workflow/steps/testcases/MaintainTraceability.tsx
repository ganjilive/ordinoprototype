import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, FileText, CheckCircle, Sparkles } from 'lucide-react';
import { Badge } from '../../../common';

interface TraceabilityLink {
  testCaseId: string;
  testCaseTitle: string;
  requirementId: string;
  requirementTitle: string;
  designId: string;
}

const traceabilityLinks: TraceabilityLink[] = [
  {
    testCaseId: 'TC-001',
    testCaseTitle: 'Verify user can login with valid credentials',
    requirementId: 'REQ-045',
    requirementTitle: 'User Authentication',
    designId: 'UI-023',
  },
  {
    testCaseId: 'TC-002',
    testCaseTitle: 'Verify login fails with invalid password',
    requirementId: 'REQ-045',
    requirementTitle: 'User Authentication',
    designId: 'UI-023',
  },
  {
    testCaseId: 'TC-003',
    testCaseTitle: 'Verify password reset functionality',
    requirementId: 'REQ-046',
    requirementTitle: 'Password Recovery',
    designId: 'UI-024',
  },
  {
    testCaseId: 'TC-004',
    testCaseTitle: 'Verify login UI renders correctly on mobile',
    requirementId: 'REQ-047',
    requirementTitle: 'Responsive Design',
    designId: 'UI-023',
  },
  {
    testCaseId: 'TC-005',
    testCaseTitle: 'Verify critical login flow end-to-end',
    requirementId: 'REQ-045',
    requirementTitle: 'User Authentication',
    designId: 'UI-023',
  },
  {
    testCaseId: 'TC-006',
    testCaseTitle: 'Verify session timeout after inactivity',
    requirementId: 'REQ-048',
    requirementTitle: 'Session Management',
    designId: 'UI-025',
  },
];

export function MaintainTraceability() {
  const [phase, setPhase] = useState(0);
  const [linkedItems, setLinkedItems] = useState<TraceabilityLink[]>([]);
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

    // Phase 0: Show linking message
    if (phase === 0) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(1);
      }, 1500);
    }

    // Phase 1: Link test cases one by one
    if (phase === 1) {
      traceabilityLinks.forEach((link, index) => {
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setLinkedItems(prev => [...prev, link]);
        }, index * 500);
      });

      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(2);
      }, traceabilityLinks.length * 500 + 500);
    }
  }, [phase]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
          animate={phase < 2 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Link2 size={28} className="text-ordino-secondary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          {phase === 0 && 'Establishing Traceability...'}
          {phase === 1 && 'Linking Test Cases to Requirements'}
          {phase === 2 && 'Traceability Matrix Complete'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase === 0 && 'Analyzing relationships between test cases, requirements, and designs'}
          {phase === 1 && 'Creating bidirectional links in Jira for full traceability'}
          {phase === 2 && `${linkedItems.length} test cases linked to requirements and UI designs`}
        </p>
      </div>

      {/* Traceability Matrix */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
            Traceability Matrix
          </h4>

          <div className="space-y-2">
            <AnimatePresence>
              {linkedItems.map((link) => (
                <motion.div
                  key={link.testCaseId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-ordino-card rounded-lg border border-ordino-border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Test Case */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-ordino-primary/10 flex-shrink-0">
                          <FileText size={16} className="text-ordino-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-ordino-text-muted">{link.testCaseId}</span>
                            <Badge variant="primary" size="sm">Test Case</Badge>
                          </div>
                          <p className="text-sm text-ordino-text">{link.testCaseTitle}</p>
                        </div>
                      </div>

                      {/* Links connector */}
                      <div className="flex items-center gap-2 pl-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-ordino-border to-transparent" />
                        <Link2 size={14} className="text-ordino-text-muted" />
                        <div className="h-px flex-1 bg-gradient-to-l from-ordino-border to-transparent" />
                      </div>

                      {/* Linked Items */}
                      <div className="grid grid-cols-2 gap-3 pl-12">
                        {/* Requirement */}
                        <div className="flex items-start gap-2">
                          <Sparkles size={14} className="text-ordino-secondary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-ordino-text-muted">{link.requirementId}</span>
                              <Badge variant="secondary" size="sm">Requirement</Badge>
                            </div>
                            <p className="text-xs text-ordino-text-muted">{link.requirementTitle}</p>
                          </div>
                        </div>

                        {/* Design */}
                        <div className="flex items-start gap-2">
                          <FileText size={14} className="text-ordino-info mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-ordino-text-muted">{link.designId}</span>
                              <Badge variant="info" size="sm">Design</Badge>
                            </div>
                            <p className="text-xs text-ordino-text-muted">UI Design Spec</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {phase === 2 && (
                      <CheckCircle size={18} className="text-ordino-success flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Summary Stats */}
      {phase === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-ordino-success/10 to-ordino-secondary/5 rounded-xl border border-ordino-success/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-ordino-success/20">
              <CheckCircle size={20} className="text-ordino-success" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ordino-text">Traceability Established</h4>
              <p className="text-xs text-ordino-text-muted">All test cases linked to requirements and designs</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-ordino-primary">{linkedItems.length}</p>
              <p className="text-xs text-ordino-text-muted mt-1">Test Cases Linked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-ordino-secondary">
                {new Set(linkedItems.map(l => l.requirementId)).size}
              </p>
              <p className="text-xs text-ordino-text-muted mt-1">Requirements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-ordino-info">
                {new Set(linkedItems.map(l => l.designId)).size}
              </p>
              <p className="text-xs text-ordino-text-muted mt-1">Designs</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
