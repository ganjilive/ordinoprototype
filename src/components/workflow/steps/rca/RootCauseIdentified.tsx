import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, AlertTriangle, Users } from 'lucide-react';
import { rcaReport } from '../../../../data/rcaMockData';

export function RootCauseIdentified() {
  const [phase, setPhase] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Phase 0: synthesizing animation
  useEffect(() => {
    if (phase !== 0) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase(1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 1: stagger content reveal
  useEffect(() => {
    if (phase !== 1) return;
    const timer = setTimeout(() => {
      if (!mountedRef.current) return;
      setShowContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Orbiting particles animation */}
      {phase === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center py-8 space-y-4"
        >
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-ordino-primary/20 to-ordino-secondary/20 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 0 0 rgba(249, 115, 22, 0.4)',
                  '0 0 40px 20px rgba(249, 115, 22, 0.1)',
                  '0 0 0 0 rgba(249, 115, 22, 0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                <Brain size={40} className="text-ordino-primary" />
              </motion.div>
            </motion.div>

            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4"
                style={{ top: '50%', left: '50%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-ordino-secondary"
                  style={{ transform: 'translateX(50px)' }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                />
              </motion.div>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-ordino-text">Synthesizing Findings...</h3>
          <p className="text-sm text-ordino-text-muted">Correlating analysis results to identify root cause</p>
        </motion.div>
      )}

      {/* Root cause content */}
      {phase >= 1 && showContent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-lg mx-auto">
          {/* Header with confidence badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-ordino-success" />
              <h3 className="text-lg font-bold text-ordino-text">Root Cause Identified</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ordino-success/20 text-ordino-success border border-ordino-success/30">
              High Confidence
            </span>
          </motion.div>

          {/* Confidence evidence */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-xs text-ordino-text-muted space-y-0.5 mt-1"
          >
            <p className="font-medium text-ordino-text-muted">Confidence factors:</p>
            <p>• 5/5 analysis modules corroborate</p>
            <p>• Causal commit within 48h of first failure</p>
            <p>• Zero competing hypotheses identified</p>
            <p>• Identical error fingerprint across all 3 builds</p>
          </motion.div>

          {/* Code diff block */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 bg-ordino-bg rounded-xl border border-ordino-border font-mono text-xs"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-ordino-text-muted">commit</span>
              <span className="text-ordino-primary font-semibold">f8a2c91</span>
              <span className="text-ordino-text-muted">— Alex Kim — 2024-01-12</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-ordino-error bg-ordino-error/10 px-2 py-1 rounded">
                <span className="text-ordino-error font-bold">-</span>
                <span>JWT_EXPIRY=3600</span>
              </div>
              <div className="flex items-center gap-2 text-ordino-success bg-ordino-success/10 px-2 py-1 rounded">
                <span className="text-ordino-success font-bold">+</span>
                <span>JWT_EXPIRY=300</span>
              </div>
            </div>
            <p className="text-ordino-text-muted mt-2">// Security hardening per SEC-089</p>
          </motion.div>

          {/* Impact summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Builds Failed', value: '3', color: 'text-ordino-error' },
              { label: 'Test Affected', value: 'TC-042', color: 'text-ordino-warning' },
              { label: 'Environment', value: 'Staging', color: 'text-ordino-secondary' },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 bg-ordino-bg rounded-xl border border-ordino-border">
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-ordino-text-muted mt-1">{item.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Root cause detail */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="p-4 bg-ordino-bg rounded-xl border border-ordino-border"
          >
            <p className="text-sm font-semibold text-ordino-text mb-1">{rcaReport.rootCause.title}</p>
            <p className="text-xs text-ordino-text-muted">{rcaReport.rootCause.detail}</p>
          </motion.div>

          {/* Human investigation callout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 bg-ordino-primary/10 rounded-xl border border-ordino-primary/30 flex items-start gap-3"
          >
            <AlertTriangle size={18} className="text-ordino-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users size={14} className="text-ordino-primary" />
                <p className="text-sm font-semibold text-ordino-primary">Human investigation required</p>
              </div>
              <p className="text-xs text-ordino-text-muted">
                Was this JWT_EXPIRY change intentional? Ordino needs confirmation before proceeding with test updates.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
