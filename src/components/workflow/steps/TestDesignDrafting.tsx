import { motion } from 'framer-motion';
import { Zap, Chrome, AlertCircle } from 'lucide-react';
import { Badge } from '../../common';
import { draftedTestCases, automationFeasibility } from '../../../data/mockData';

export function TestDesignDrafting() {
  const getFeasibilityColor = (score: number) => {
    if (score >= 80) return 'text-ordino-success';
    if (score >= 60) return 'text-yellow-500';
    return 'text-ordino-error';
  };

  const getFeasibilityBg = (score: number) => {
    if (score >= 80) return 'bg-ordino-success/10 border-ordino-success/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-ordino-error/10 border-ordino-error/20';
  };

  const getROIVariant = (roi: string): 'success' | 'warning' | 'error' => {
    switch (roi) {
      case 'High':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Low':
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
          <h3 className="text-xl font-bold text-ordino-text mb-1">Test Design Drafting</h3>
          <p className="text-sm text-ordino-text-muted">
            Early automation feasibility assessment for each test case
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">
            Overall Score: {automationFeasibility.overallScore}%
          </Badge>
        </div>
      </div>

      {/* Framework Recommendation */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-ordino-primary/10 to-transparent rounded-xl border border-ordino-primary/20 p-4"
      >
        <div className="flex items-start gap-3">
          <Zap size={24} className="text-ordino-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-ordino-text mb-2">Framework Recommendation</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">Primary</Badge>
                <span className="text-sm text-ordino-text font-medium">
                  {automationFeasibility.frameworkRecommendation.primary}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">Alternative</Badge>
                <span className="text-sm text-ordino-text-muted">
                  {automationFeasibility.frameworkRecommendation.alternative}
                </span>
              </div>
              <p className="text-xs text-ordino-text-muted mt-2">
                {automationFeasibility.frameworkRecommendation.reasoning}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Test Cases with Feasibility */}
      <div className="space-y-3">
        <h4 className="font-semibold text-ordino-text">Drafted Test Cases with Automation Feasibility</h4>

        {draftedTestCases.map((testCase, index) => {
          const feasibility = automationFeasibility.testCases.find(
            (tc) => tc.testCaseId === testCase.id
          );

          if (!feasibility) return null;

          return (
            <motion.div
              key={testCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`rounded-xl border p-4 ${getFeasibilityBg(feasibility.feasibilityScore)}`}
            >
              {/* Test Case Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-ordino-text-muted">
                      {testCase.id}
                    </span>
                    <Badge
                      variant={testCase.priority === 'High' ? 'error' : testCase.priority === 'Medium' ? 'warning' : 'secondary'}
                      size="sm"
                    >
                      {testCase.priority}
                    </Badge>
                  </div>
                  <h5 className="font-medium text-ordino-text">{testCase.title}</h5>
                  <p className="text-xs text-ordino-text-muted mt-1">{testCase.description}</p>
                </div>
              </div>

              {/* Automation Feasibility Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-ordino-border/50">
                {/* Feasibility Score */}
                <div>
                  <p className="text-xs text-ordino-text-muted mb-1">Feasibility</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getFeasibilityColor(feasibility.feasibilityScore)}`}>
                      {feasibility.feasibilityScore}%
                    </span>
                  </div>
                </div>

                {/* ROI */}
                <div>
                  <p className="text-xs text-ordino-text-muted mb-1">Automation ROI</p>
                  <Badge variant={getROIVariant(feasibility.estimatedROI)} size="sm">
                    {feasibility.estimatedROI}
                  </Badge>
                </div>

                {/* Complexity */}
                <div>
                  <p className="text-xs text-ordino-text-muted mb-1">Complexity</p>
                  <span className="text-sm text-ordino-text">{feasibility.complexity}</span>
                </div>

                {/* Maintenance Risk */}
                <div>
                  <p className="text-xs text-ordino-text-muted mb-1">Maintenance</p>
                  <span className="text-sm text-ordino-text">{feasibility.maintenanceRisk}</span>
                </div>
              </div>

              {/* Framework & Browser Support */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-ordino-border/50">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-ordino-primary" />
                  <span className="text-xs text-ordino-text">{feasibility.recommendedFramework}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Chrome size={14} className="text-ordino-text-muted" />
                  <span className="text-xs text-ordino-text-muted">
                    {feasibility.browserCompatibility.join(', ')}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <h4 className="font-semibold text-ordino-text mb-3">Automation Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-ordino-success">
              {automationFeasibility.testCases.filter((tc) => tc.feasibilityScore >= 80).length}
            </p>
            <p className="text-xs text-ordino-text-muted mt-1">High Feasibility</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {automationFeasibility.testCases.filter((tc) => tc.feasibilityScore >= 60 && tc.feasibilityScore < 80).length}
            </p>
            <p className="text-xs text-ordino-text-muted mt-1">Medium Feasibility</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-ordino-error">
              {automationFeasibility.testCases.filter((tc) => tc.feasibilityScore < 60).length}
            </p>
            <p className="text-xs text-ordino-text-muted mt-1">Low Feasibility</p>
          </div>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
      >
        <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-ordino-text-muted">
          Early feasibility assessment helps prioritize automation efforts and identify potential challenges
          before detailed test case creation begins.
        </p>
      </motion.div>
    </motion.div>
  );
}
