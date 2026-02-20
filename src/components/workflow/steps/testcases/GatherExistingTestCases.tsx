import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, RefreshCw, Filter } from 'lucide-react';
import { Badge, Card } from '../../../common';

interface ExistingTestCase {
  id: string;
  title: string;
  status: 'valid' | 'needs-update' | 'outdated';
  lastModified: string;
}

const existingTestCases: ExistingTestCase[] = [
  { id: 'TC-012', title: 'Verify user login flow', status: 'needs-update', lastModified: '2025-11-15' },
  { id: 'TC-018', title: 'Verify password validation', status: 'valid', lastModified: '2026-01-10' },
  { id: 'TC-024', title: 'Verify OAuth login', status: 'outdated', lastModified: '2025-09-20' },
  { id: 'TC-031', title: 'Verify session management', status: 'needs-update', lastModified: '2025-12-05' },
  { id: 'TC-047', title: 'Verify login error messages', status: 'valid', lastModified: '2026-02-01' },
];

export function GatherExistingTestCases() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [gatheredCases, setGatheredCases] = useState<ExistingTestCase[]>([]);
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

    // Phase 0: Show searching message
    if (currentPhase === 0) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setCompletedPhases(prev => [...prev, 0]);
        setCurrentPhase(1);
      }, 1500);
    }

    // Phase 1: Show filtering by requirement
    if (currentPhase === 1) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setCompletedPhases(prev => [...prev, 1]);
        setCurrentPhase(2);
      }, 1200);
    }

    // Phase 2: Show gathered test cases one by one
    if (currentPhase === 2) {
      existingTestCases.forEach((testCase, index) => {
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setGatheredCases(prev => [...prev, testCase]);
        }, index * 300);
      });

      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setCompletedPhases(prev => [...prev, 2]);
        setCurrentPhase(3);
      }, existingTestCases.length * 300 + 500);
    }

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [currentPhase]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'success';
      case 'needs-update':
        return 'warning';
      case 'outdated':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Still Valid';
      case 'needs-update':
        return 'Needs Update';
      case 'outdated':
        return 'Outdated';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase 0: Searching */}
      {currentPhase >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-ordino-primary/10 rounded-lg border border-ordino-primary/30"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            <RefreshCw className="text-ordino-primary" size={20} />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-ordino-text">Searching Test Management Tool</p>
            <p className="text-xs text-ordino-text-muted">Connecting to TestRail...</p>
          </div>
        </motion.div>
      )}

      {/* Phase 1: Filtering */}
      {currentPhase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-ordino-secondary/10 rounded-lg border border-ordino-secondary/30"
        >
          <Filter className="text-ordino-secondary" size={20} />
          <div>
            <p className="text-sm font-medium text-ordino-text">Filtering Test Cases</p>
            <p className="text-xs text-ordino-text-muted">
              Searching for test cases linked to requirement ORD-1234
            </p>
          </div>
        </motion.div>
      )}

      {/* Phase 2: Display gathered test cases */}
      {currentPhase >= 2 && gatheredCases.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ordino-text">
              Existing Test Cases Found
            </h3>
            <Badge variant="primary">{gatheredCases.length} Cases</Badge>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {gatheredCases.map((testCase, index) => (
                <motion.div
                  key={testCase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-ordino-bg rounded-lg border border-ordino-border hover:border-ordino-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText size={18} className="text-ordino-text-muted" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ordino-text">
                        {testCase.id}
                      </p>
                      <p className="text-xs text-ordino-text-muted">
                        {testCase.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-xs text-ordino-text-muted">
                      Modified: {testCase.lastModified}
                    </p>
                    <Badge variant={getStatusColor(testCase.status)} size="sm">
                      {getStatusLabel(testCase.status)}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>
      )}

      {/* Phase 3: Analysis summary */}
      {completedPhases.includes(2) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="bg-ordino-success/10 border-ordino-success/30">
            <div className="text-center p-4">
              <p className="text-2xl font-bold text-ordino-success">2</p>
              <p className="text-sm text-ordino-text-muted">Still Valid</p>
            </div>
          </Card>

          <Card className="bg-ordino-warning/10 border-ordino-warning/30">
            <div className="text-center p-4">
              <p className="text-2xl font-bold text-ordino-warning">2</p>
              <p className="text-sm text-ordino-text-muted">Need Updates</p>
            </div>
          </Card>

          <Card className="bg-ordino-error/10 border-ordino-error/30">
            <div className="text-center p-4">
              <p className="text-2xl font-bold text-ordino-error">1</p>
              <p className="text-sm text-ordino-text-muted">Outdated</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Completion indicator */}
      {completedPhases.includes(2) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 bg-ordino-success/10 rounded-lg border border-ordino-success/30"
        >
          <CheckCircle className="text-ordino-success" size={20} />
          <div>
            <p className="text-sm font-medium text-ordino-text">Analysis Complete</p>
            <p className="text-xs text-ordino-text-muted">
              Identified which test cases can be reused and which need updates for new requirements
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
