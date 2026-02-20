import { motion } from 'framer-motion';
import { Brain, Sparkles, Search, FileText, CheckCircle, AlertCircle, Clock, Shield, ListChecks } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '../../common';
import { triageAnalysis } from '../../../data/mockData';

const analysisSteps = [
  { icon: Search, text: 'Scanning requirement details...' },
  { icon: FileText, text: 'Extracting acceptance criteria...' },
  { icon: Brain, text: 'Analyzing testability factors...' },
  { icon: CheckCircle, text: 'Generating coverage analysis...' },
];

export function OrdinoThinking() {
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showTriageResults, setShowTriageResults] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentAnalysisStep((prev) => (prev + 1) % analysisSteps.length);
    }, 1500);

    // Show triage results after analysis completes
    const triageTimeout = setTimeout(() => {
      setShowTriageResults(true);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(triageTimeout);
    };
  }, []);

  const getTestabilityColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-ordino-success';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-ordino-error';
      default:
        return 'text-ordino-text-muted';
    }
  };

  const getSeverityVariant = (severity: string): 'success' | 'warning' | 'error' => {
    switch (severity) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Analysis Animation Section */}
      <div className="flex flex-col items-center justify-center py-4">
        {/* AI Brain Animation */}
        <div className="relative mb-6">
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Brain size={40} className="text-ordino-primary" />
            </motion.div>
          </motion.div>

          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 1,
              }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-ordino-secondary"
                style={{
                  transform: 'translateX(50px)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Status text */}
        <motion.div
          key={currentAnalysisStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4"
        >
          <Sparkles size={16} className="text-ordino-primary" />
          <span className="text-ordino-text">
            {analysisSteps[currentAnalysisStep].text}
          </span>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full max-w-md">
          <div className="flex justify-between text-xs text-ordino-text-muted mb-2">
            <span>Analyzing Requirement & Triage Assessment</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          <div className="h-2 bg-ordino-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-ordino-primary to-ordino-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Analysis details */}
        <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-md">
          {analysisSteps.map((step, index) => {
            const Icon = step.icon;
            const isComplete = (progress / 100) * 4 > index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: isComplete ? 1 : 0.5 }}
                className="flex items-center gap-2 text-sm"
              >
                <Icon
                  size={16}
                  className={isComplete ? 'text-ordino-success' : 'text-ordino-text-muted'}
                />
                <span className={isComplete ? 'text-ordino-text' : 'text-ordino-text-muted'}>
                  {step.text.replace('...', '')}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Triage Results Section - appears after analysis */}
      {showTriageResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 border-t border-ordino-border pt-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-ordino-text mb-1">Triage Assessment</h3>
              <p className="text-sm text-ordino-text-muted">
                AI-powered assessment of requirement quality and testability
              </p>
            </div>
            <Badge variant="primary">AI Analysis</Badge>
          </div>

          {/* Completeness Score */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListChecks size={18} className="text-ordino-primary" />
                <h4 className="font-semibold text-ordino-text">Completeness Score</h4>
              </div>
              <span className="text-2xl font-bold text-ordino-primary">
                {triageAnalysis.completenessScore}%
              </span>
            </div>
            <div className="w-full bg-ordino-border rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${triageAnalysis.completenessScore}%` }}
                transition={{ delay: 0.4, duration: 1 }}
                className="bg-ordino-primary h-2 rounded-full"
              />
            </div>
          </motion.div>

          {/* Testability Level */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className={getTestabilityColor(triageAnalysis.testabilityLevel)} />
              <h4 className="font-semibold text-ordino-text text-sm">Testability</h4>
            </div>
            <p className={`text-xl font-bold ${getTestabilityColor(triageAnalysis.testabilityLevel)}`}>
              {triageAnalysis.testabilityLevel}
            </p>
          </motion.div>

          {/* Identified Gaps */}
          {triageAnalysis.gaps.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-yellow-500" />
                <h4 className="font-semibold text-ordino-text text-sm">Identified Gaps</h4>
              </div>
              <div className="space-y-2">
                {triageAnalysis.gaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="flex items-start gap-3 p-2 bg-ordino-card rounded-lg"
                  >
                    <Badge variant={getSeverityVariant(gap.severity)} size="sm">
                      {gap.severity}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-xs text-ordino-text">{gap.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Risk Flags */}
          {triageAnalysis.riskFlags.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-ordino-error" />
                <h4 className="font-semibold text-ordino-text text-sm">Risk Flags</h4>
              </div>
              <div className="space-y-2">
                {triageAnalysis.riskFlags.map((risk, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-ordino-card rounded-lg border-l-2 border-ordino-error"
                  >
                    <Badge variant="error" size="sm">
                      {risk.impact}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-ordino-text">{risk.type}</p>
                      <p className="text-xs text-ordino-text-muted">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommended Approach */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-ordino-primary/10 to-transparent rounded-xl border border-ordino-primary/20 p-4"
          >
            <h4 className="font-semibold text-ordino-text mb-2 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-ordino-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Recommended Approach
            </h4>
            <p className="text-sm text-ordino-text-muted">
              {triageAnalysis.recommendedApproach}
            </p>
          </motion.div>

          {/* Next Step Hint */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-ordino-secondary/10 rounded-xl border border-ordino-secondary/20 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ordino-secondary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-ordino-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-ordino-text text-sm mb-1">Next Step</h4>
                <p className="text-sm text-ordino-text-muted">
                  Ordino wants to collaborate with the BA and QA Lead to refine the requirement and address the identified gaps.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
