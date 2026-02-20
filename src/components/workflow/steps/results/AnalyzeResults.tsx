import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Bug } from 'lucide-react';
import { Badge } from '../../../common';

export function AnalyzeResults() {
  const [phase, setPhase] = useState(0);
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

    // Phase transitions
    if (phase === 0) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(1);
      }, 1500);
    } else if (phase === 1) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(2);
      }, 2000);
    } else if (phase === 2) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(3);
      }, 2000);
    }
  }, [phase]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
          animate={phase < 3 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <BarChart3 size={28} className="text-ordino-secondary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          {phase === 0 && 'Analyzing Test Results...'}
          {phase === 1 && 'Computing Metrics & Trends'}
          {phase === 2 && 'Classifying Failures'}
          {phase === 3 && 'Analysis Complete'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase === 0 && 'Performing comprehensive analysis on 240 test results'}
          {phase === 1 && 'Calculating pass rates, coverage metrics, and trend patterns'}
          {phase === 2 && 'Categorizing failures by type and identifying patterns'}
          {phase === 3 && 'All analysis complete with actionable insights generated'}
        </p>
      </div>

      {/* Pass/Fail Metrics */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
            Test Execution Metrics
          </h4>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-ordino-success/10 rounded-lg border border-ordino-success/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={18} className="text-ordino-success" />
                <span className="text-sm font-medium text-ordino-text">Passed</span>
              </div>
              <p className="text-3xl font-bold text-ordino-success">195</p>
              <p className="text-xs text-ordino-text-muted mt-1">81.25% pass rate</p>
            </div>

            <div className="bg-ordino-error/10 rounded-lg border border-ordino-error/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={18} className="text-ordino-error" />
                <span className="text-sm font-medium text-ordino-text">Failed</span>
              </div>
              <p className="text-3xl font-bold text-ordino-error">45</p>
              <p className="text-xs text-ordino-text-muted mt-1">18.75% failure rate</p>
            </div>

            <div className="bg-ordino-warning/10 rounded-lg border border-ordino-warning/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-ordino-warning" />
                <span className="text-sm font-medium text-ordino-text">Trend</span>
              </div>
              <p className="text-3xl font-bold text-ordino-warning">+5%</p>
              <p className="text-xs text-ordino-text-muted mt-1">vs previous build</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Failure Classification */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
            Failure Classification
          </h4>

          <div className="space-y-2">
            {[
              { category: 'Product Defects', count: 12, percentage: 27, variant: 'error' as const, needsJira: true },
              { category: 'Test Script Issues', count: 18, percentage: 40, variant: 'warning' as const, needsJira: false },
              { category: 'Environment Issues', count: 10, percentage: 22, variant: 'info' as const, needsJira: false },
              { category: 'Data Issues', count: 5, percentage: 11, variant: 'secondary' as const, needsJira: false },
            ].map((item) => (
              <div
                key={item.category}
                className="bg-ordino-card rounded-lg border border-ordino-border p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ordino-text">{item.category}</span>
                    {item.needsJira && (
                      <Badge variant="error" size="sm">
                        <Bug size={12} />
                        Auto-create Jira
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-ordino-text">{item.count}</span>
                    <Badge variant={item.variant} size="sm">{item.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-ordino-border rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-2 rounded-full ${
                      item.variant === 'error' ? 'bg-ordino-error' :
                      item.variant === 'warning' ? 'bg-ordino-warning' :
                      item.variant === 'info' ? 'bg-ordino-info' :
                      'bg-ordino-secondary'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trend Analysis */}
      {phase >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-ordino-primary/10 to-ordino-secondary/5 rounded-xl border border-ordino-primary/20 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-ordino-primary/20">
              <TrendingUp size={20} className="text-ordino-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ordino-text">Trend Insights</h4>
              <p className="text-xs text-ordino-text-muted">Historical pattern analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-ordino-bg/50 rounded-lg p-3">
              <p className="text-xs text-ordino-text-muted mb-1">7-Day Pass Rate</p>
              <p className="text-xl font-bold text-ordino-success">83.2%</p>
              <p className="text-xs text-ordino-success mt-1">↑ 2.1% improvement</p>
            </div>
            <div className="bg-ordino-bg/50 rounded-lg p-3">
              <p className="text-xs text-ordino-text-muted mb-1">Flaky Tests Detected</p>
              <p className="text-xl font-bold text-ordino-warning">8</p>
              <p className="text-xs text-ordino-warning mt-1">Requires investigation</p>
            </div>
            <div className="bg-ordino-bg/50 rounded-lg p-3">
              <p className="text-xs text-ordino-text-muted mb-1">Avg Execution Time</p>
              <p className="text-xl font-bold text-ordino-primary">12m 34s</p>
              <p className="text-xs text-ordino-primary mt-1">↓ 18% faster</p>
            </div>
            <div className="bg-ordino-bg/50 rounded-lg p-3">
              <p className="text-xs text-ordino-text-muted mb-1">Code Coverage</p>
              <p className="text-xl font-bold text-ordino-secondary">87.5%</p>
              <p className="text-xs text-ordino-secondary mt-1">↑ 3.2% increase</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
