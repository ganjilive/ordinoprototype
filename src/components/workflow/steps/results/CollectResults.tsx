import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, CheckCircle, TrendingUp } from 'lucide-react';
import { Badge } from '../../../common';

interface ResultSource {
  id: string;
  name: string;
  type: 'local' | 'pipeline' | 'integration';
  testCount: number;
  status: 'collecting' | 'completed';
}

const resultSources: ResultSource[] = [
  { id: '1', name: 'Local Test Execution', type: 'local', testCount: 45, status: 'collecting' },
  { id: '2', name: 'CI/CD Pipeline (Build #1247)', type: 'pipeline', testCount: 128, status: 'collecting' },
  { id: '3', name: 'Integration Test Suite', type: 'integration', testCount: 67, status: 'collecting' },
];

export function CollectResults() {
  const [phase, setPhase] = useState(0);
  const [collectedSources, setCollectedSources] = useState<ResultSource[]>([]);
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

    // Phase 0: Show collecting message
    if (phase === 0) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(1);
      }, 1500);
    }

    // Phase 1: Collect results one by one
    if (phase === 1) {
      resultSources.forEach((source, index) => {
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setCollectedSources(prev => [...prev, { ...source, status: 'completed' }]);
        }, index * 800);
      });

      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(2);
      }, resultSources.length * 800 + 500);
    }
  }, [phase]);

  const getTypeBadgeVariant = (type: ResultSource['type']) => {
    switch (type) {
      case 'local':
        return 'info';
      case 'pipeline':
        return 'primary';
      case 'integration':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const totalTests = collectedSources.reduce((acc, source) => acc + source.testCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
          animate={phase < 2 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Database size={28} className="text-ordino-primary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          {phase === 0 && 'Collecting Test Results...'}
          {phase === 1 && 'Gathering Results from Multiple Sources'}
          {phase === 2 && 'Results Collection Complete'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase === 0 && 'Connecting to test execution sources and databases'}
          {phase === 1 && 'Aggregating test results from local, CI/CD, and integration environments'}
          {phase === 2 && `${totalTests} test results collected from ${collectedSources.length} sources`}
        </p>
      </div>

      {/* Result Sources */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
            Result Sources
          </h4>

          <div className="space-y-2">
            <AnimatePresence>
              {collectedSources.map((source) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-ordino-card rounded-lg border border-ordino-border p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-ordino-primary/10 flex-shrink-0">
                        <Database size={16} className="text-ordino-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-ordino-text">{source.name}</span>
                          <Badge variant={getTypeBadgeVariant(source.type)} size="sm">
                            {source.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-ordino-text-muted">{source.testCount} test results</p>
                      </div>
                    </div>
                    <CheckCircle size={18} className="text-ordino-success flex-shrink-0" />
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
          className="bg-gradient-to-br from-ordino-success/10 to-ordino-primary/5 rounded-xl border border-ordino-success/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-ordino-success/20">
              <TrendingUp size={20} className="text-ordino-success" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ordino-text">Collection Summary</h4>
              <p className="text-xs text-ordino-text-muted">All test results aggregated and ready for analysis</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-ordino-primary">{totalTests}</p>
              <p className="text-xs text-ordino-text-muted mt-1">Total Tests</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-ordino-secondary">{collectedSources.length}</p>
              <p className="text-xs text-ordino-text-muted mt-1">Sources</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-ordino-success">100%</p>
              <p className="text-xs text-ordino-text-muted mt-1">Collected</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
