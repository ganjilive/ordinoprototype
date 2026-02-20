import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, Shield, ListChecks } from 'lucide-react';
import { Badge } from '../../common';
import { triageAnalysis } from '../../../data/mockData';

export function RequirementsTriage() {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Requirements Triage Analysis</h3>
          <p className="text-sm text-ordino-text-muted">
            AI-powered assessment of requirement quality and testability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">AI Analysis</Badge>
        </div>
      </div>

      {/* Completeness Score */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListChecks size={20} className="text-ordino-primary" />
            <h4 className="font-semibold text-ordino-text">Completeness Score</h4>
          </div>
          <span className="text-3xl font-bold text-ordino-primary">
            {triageAnalysis.completenessScore}%
          </span>
        </div>
        <div className="w-full bg-ordino-border rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${triageAnalysis.completenessScore}%` }}
            transition={{ delay: 0.4, duration: 1 }}
            className="bg-ordino-primary h-3 rounded-full"
          />
        </div>
        <p className="text-sm text-ordino-text-muted mt-2">
          Requirement contains most necessary information for test design
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {/* Testability Level */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className={getTestabilityColor(triageAnalysis.testabilityLevel)} />
            <h4 className="font-semibold text-ordino-text">Testability Level</h4>
          </div>
          <p className={`text-2xl font-bold ${getTestabilityColor(triageAnalysis.testabilityLevel)}`}>
            {triageAnalysis.testabilityLevel}
          </p>
          <p className="text-xs text-ordino-text-muted mt-1">
            Clear acceptance criteria and measurable outcomes
          </p>
        </motion.div>

        {/* Estimated Effort */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-ordino-primary" />
            <h4 className="font-semibold text-ordino-text">Testing Effort</h4>
          </div>
          <p className="text-2xl font-bold text-ordino-text">
            {triageAnalysis.estimatedTestingEffort}
          </p>
          <p className="text-xs text-ordino-text-muted mt-1">
            Estimated time for test design and execution
          </p>
        </motion.div>
      </div>

      {/* Identified Gaps */}
      {triageAnalysis.gaps.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-yellow-500" />
            <h4 className="font-semibold text-ordino-text">Identified Gaps</h4>
          </div>
          <div className="space-y-2">
            {triageAnalysis.gaps.map((gap) => (
              <div
                key={gap.id}
                className="flex items-start gap-3 p-3 bg-ordino-card rounded-lg"
              >
                <Badge variant={getSeverityVariant(gap.severity)} size="sm">
                  {gap.severity}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm text-ordino-text">{gap.description}</p>
                  <p className="text-xs text-ordino-text-muted mt-1">Type: {gap.type}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Dependencies */}
      {triageAnalysis.dependencies.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-ordino-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h4 className="font-semibold text-ordino-text">Dependencies</h4>
          </div>
          <div className="space-y-2">
            {triageAnalysis.dependencies.map((dep) => {
              const status = dep.status as 'Available' | 'In Progress' | 'Unknown';
              return (
                <div
                  key={dep.id}
                  className="flex items-center justify-between p-3 bg-ordino-card rounded-lg"
                >
                  <span className="text-sm text-ordino-text">{dep.name}</span>
                  <Badge
                    variant={
                      status === 'Available' ? 'success' : status === 'In Progress' ? 'warning' : status === 'Unknown' ? 'default' : 'error'
                    }
                    size="sm"
                  >
                    {dep.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Risk Flags */}
      {triageAnalysis.riskFlags.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-ordino-error" />
            <h4 className="font-semibold text-ordino-text">Risk Flags</h4>
          </div>
          <div className="space-y-2">
            {triageAnalysis.riskFlags.map((risk, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-ordino-card rounded-lg border-l-4 border-ordino-error"
              >
                <Badge variant="error" size="sm">
                  {risk.impact} Impact
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ordino-text">{risk.type}</p>
                  <p className="text-xs text-ordino-text-muted mt-1">{risk.description}</p>
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
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-ordino-primary/10 to-transparent rounded-xl border border-ordino-primary/20 p-4"
      >
        <h4 className="font-semibold text-ordino-text mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-ordino-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Recommended Approach
        </h4>
        <p className="text-sm text-ordino-text-muted">
          {triageAnalysis.recommendedApproach}
        </p>
      </motion.div>
    </motion.div>
  );
}
