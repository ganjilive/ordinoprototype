import { motion } from 'framer-motion';
import { Target, CheckCircle, AlertCircle, TrendingUp, BarChart3, Info } from 'lucide-react';
import { Badge } from '../../common';

interface CoverageAnalysisProps {
  requirementCoverage: {
    requirementId: string;
    requirementTitle: string;
    coveragePercentage: number;
    testCasesCount: number;
    status: 'complete' | 'partial' | 'insufficient';
  }[];
  overallCoverage: {
    requirementsCovered: number;
    totalRequirements: number;
    testCasesCount: number;
    automationPercentage: number;
  };
  gaps?: string[];
}

export function CoverageAnalysis({ requirementCoverage, overallCoverage, gaps }: CoverageAnalysisProps) {
  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-ordino-success';
    if (percentage >= 50) return 'text-ordino-warning';
    return 'text-ordino-error';
  };

  const getCoverageVariant = (status: string) => {
    if (status === 'complete') return 'success';
    if (status === 'partial') return 'warning';
    return 'error';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={18} className="text-ordino-primary" />
        <h4 className="font-semibold text-ordino-text">Test Coverage Analysis</h4>
        <Badge variant="info" size="sm">ISTQB Standard</Badge>
      </div>

      {/* Overall Coverage Summary */}
      <div className="bg-ordino-card rounded-lg border border-ordino-border p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-ordino-primary" />
              <span className="text-sm font-medium text-ordino-text">Requirements Coverage</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${getCoverageColor((overallCoverage.requirementsCovered / overallCoverage.totalRequirements) * 100)}`}>
                {Math.round((overallCoverage.requirementsCovered / overallCoverage.totalRequirements) * 100)}%
              </span>
              <span className="text-xs text-ordino-text-muted">
                ({overallCoverage.requirementsCovered}/{overallCoverage.totalRequirements})
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-ordino-success" />
              <span className="text-sm font-medium text-ordino-text">Test Cases</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ordino-text">
                {overallCoverage.testCasesCount}
              </span>
              <span className="text-xs text-ordino-text-muted">total</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-ordino-info" />
              <span className="text-sm font-medium text-ordino-text">Automation</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${getCoverageColor(overallCoverage.automationPercentage)}`}>
                {overallCoverage.automationPercentage}%
              </span>
              <span className="text-xs text-ordino-text-muted">automated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requirement-Level Coverage */}
      <div className="space-y-3">
        <h5 className="text-sm font-semibold text-ordino-text">Requirement-Level Coverage</h5>
        {requirementCoverage.map((item, index) => (
          <motion.div
            key={item.requirementId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-ordino-card rounded-lg border border-ordino-border p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-ordino-primary">{item.requirementId}</span>
                  <Badge variant={getCoverageVariant(item.status)} size="sm">
                    {item.status === 'complete' ? 'Complete' : item.status === 'partial' ? 'Partial' : 'Insufficient'}
                  </Badge>
                </div>
                <p className="text-sm text-ordino-text">{item.requirementTitle}</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getCoverageColor(item.coveragePercentage)}`}>
                  {item.coveragePercentage}%
                </div>
                <div className="text-xs text-ordino-text-muted">
                  {item.testCasesCount} test case{item.testCasesCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            {/* Coverage Bar */}
            <div className="mt-2 h-2 bg-ordino-bg rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.coveragePercentage}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${
                  item.coveragePercentage >= 80
                    ? 'bg-ordino-success'
                    : item.coveragePercentage >= 50
                    ? 'bg-ordino-warning'
                    : 'bg-ordino-error'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coverage Gaps */}
      {gaps && gaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-ordino-warning" />
            <span className="text-sm font-semibold text-ordino-text">Coverage Gaps Identified</span>
          </div>
          <ul className="space-y-1 ml-6">
            {gaps.map((gap, index) => (
              <li key={index} className="text-xs text-ordino-text-muted flex items-start gap-2">
                <span className="text-ordino-warning mt-0.5">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Coverage Standards Info */}
      <div className="mt-4 p-3 bg-ordino-info/10 rounded-lg border border-ordino-info/20">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-ordino-info flex-shrink-0 mt-0.5" />
          <div className="text-xs text-ordino-text-muted">
            <p className="font-medium text-ordino-text mb-1">Coverage Standards:</p>
            <ul className="space-y-1 ml-4">
              <li>• Complete: 80%+ coverage with all critical paths tested</li>
              <li>• Partial: 50-79% coverage, some gaps remain</li>
              <li>• Insufficient: &lt;50% coverage, significant gaps</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
