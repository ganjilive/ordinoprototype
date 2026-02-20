import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, Sparkles } from 'lucide-react';
import { Badge } from '../../../common';

interface TestCase {
  id: string;
  title: string;
  type: 'automate' | 'manual' | 'smoke';
  priority: 'high' | 'medium' | 'low';
}

const generatedTestCases: TestCase[] = [
  { id: 'TC-001', title: 'Verify user can login with valid credentials', type: 'automate', priority: 'high' },
  { id: 'TC-002', title: 'Verify login fails with invalid password', type: 'automate', priority: 'high' },
  { id: 'TC-003', title: 'Verify password reset functionality', type: 'automate', priority: 'medium' },
  { id: 'TC-004', title: 'Verify login UI renders correctly on mobile', type: 'manual', priority: 'medium' },
  { id: 'TC-005', title: 'Verify critical login flow end-to-end', type: 'smoke', priority: 'high' },
  { id: 'TC-006', title: 'Verify session timeout after inactivity', type: 'automate', priority: 'low' },
];

export function GenerateTestCases() {
  const [phase, setPhase] = useState(0);
  const [generatedCases, setGeneratedCases] = useState<TestCase[]>([]);
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

    // Phase 0: Show generating message
    if (phase === 0) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(1);
      }, 1500);
    }

    // Phase 1: Generate test cases one by one
    if (phase === 1) {
      generatedTestCases.forEach((testCase, index) => {
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setGeneratedCases(prev => [...prev, testCase]);
        }, index * 600);
      });

      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(2);
      }, generatedTestCases.length * 600 + 500);
    }
  }, [phase]);

  const getBadgeVariant = (type: TestCase['type']) => {
    switch (type) {
      case 'automate':
        return 'primary';
      case 'manual':
        return 'secondary';
      case 'smoke':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: TestCase['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
          animate={phase < 2 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Sparkles size={28} className="text-ordino-primary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          {phase === 0 && 'Generating Test Cases...'}
          {phase === 1 && 'Creating Test Cases'}
          {phase === 2 && 'Test Cases Generated Successfully'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase === 0 && 'Analyzing test design and requirements to identify test coverage gaps'}
          {phase === 1 && 'Generating test cases with execution strategy labels'}
          {phase === 2 && `${generatedCases.length} test cases created and categorized for execution`}
        </p>
      </div>

      {/* Test Cases Table */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
              Generated Test Cases
            </h4>
            <div className="flex items-center gap-2 text-xs text-ordino-text-muted">
              <Badge variant="primary" size="sm">Automate</Badge>
              <Badge variant="secondary" size="sm">Manual</Badge>
              <Badge variant="warning" size="sm">Smoke</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {generatedCases.map((testCase) => (
                <motion.div
                  key={testCase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-ordino-card rounded-lg border border-ordino-border p-4 hover:border-ordino-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-ordino-primary/10 flex-shrink-0">
                        <FileText size={16} className="text-ordino-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-ordino-text-muted">{testCase.id}</span>
                          <Badge variant={getBadgeVariant(testCase.type)} size="sm">
                            {testCase.type}
                          </Badge>
                          <Badge variant={getPriorityBadgeVariant(testCase.priority)} size="sm">
                            {testCase.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-ordino-text">{testCase.title}</p>
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
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-ordino-primary/10 rounded-lg border border-ordino-primary/30 p-4 text-center">
            <p className="text-2xl font-bold text-ordino-primary">
              {generatedCases.filter(tc => tc.type === 'automate').length}
            </p>
            <p className="text-xs text-ordino-text-muted mt-1">Automate</p>
          </div>
          <div className="bg-ordino-secondary/10 rounded-lg border border-ordino-secondary/30 p-4 text-center">
            <p className="text-2xl font-bold text-ordino-secondary">
              {generatedCases.filter(tc => tc.type === 'manual').length}
            </p>
            <p className="text-xs text-ordino-text-muted mt-1">Manual</p>
          </div>
          <div className="bg-ordino-warning/10 rounded-lg border border-ordino-warning/30 p-4 text-center">
            <p className="text-2xl font-bold text-ordino-warning">
              {generatedCases.filter(tc => tc.type === 'smoke').length}
            </p>
            <p className="text-xs text-ordino-text-muted mt-1">Smoke</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
