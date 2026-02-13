import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Chrome, AlertCircle, CheckCircle, GitBranch, FileText, Link, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../../common';
import { testDesign, draftedTestCases, automationFeasibility, traceabilityMatrix, coverageAnalysis } from '../../../data/mockData';
import { TraceabilityMatrix } from './TraceabilityMatrix';
import { CoverageAnalysis } from './CoverageAnalysis';

export function TestDesignDrafting() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [expandedTestCases, setExpandedTestCases] = useState<Set<string>>(new Set());

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setPhaseProgress((prev) => {
        if (prev >= 100) {
          if (currentPhase < 3) {
            // Mark current phase as completed before moving to next (4 phases: 0-3)
            setCompletedPhases((prev) => new Set(prev).add(currentPhase));
            setCurrentPhase((prev) => prev + 1);
            return 0;
          } else {
            // Mark final phase as completed
            setCompletedPhases((prev) => new Set(prev).add(currentPhase));
            return 100;
          }
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [currentPhase]);

  const toggleTestCase = (id: string) => {
    const newSet = new Set(expandedTestCases);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedTestCases(newSet);
  };

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

  // Phase 1: Draft Test Design (Scenarios, Paths, Conditions)
  const renderPhase1 = (isCompleted: boolean) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {isCompleted ? (
          <CheckCircle size={20} className="text-ordino-success" />
        ) : (
          <GitBranch size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Test Design Draft Complete' : 'Drafting test design (scenarios, paths, conditions)...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={20} className="text-ordino-primary" />
          <h3 className="text-lg font-semibold text-ordino-text">{testDesign.name}</h3>
          <Badge variant="info" size="sm">v{testDesign.version} (Draft)</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-ordino-text mb-2">Test Paths</h4>
            <div className="space-y-3">
              {testDesign.paths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={`p-4 rounded-lg border ${
                    path.status === 'affected'
                      ? 'bg-ordino-warning/10 border-ordino-warning/30'
                      : 'bg-ordino-card border-ordino-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-ordino-text">{path.name}</span>
                    <div className="flex items-center gap-2">
                      {path.status === 'affected' && (
                        <Badge variant="warning" size="sm">Modified</Badge>
                      )}
                      <Badge variant="primary" size="sm">Draft</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-ordino-text-muted">{path.description}</p>
                  {path.status === 'affected' && (
                    <p className="text-xs text-ordino-warning mt-2">{path.affectedReason}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* New 2FA Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-lg border bg-ordino-success/10 border-ordino-success/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-ordino-text">2FA Authentication Path</span>
              <Badge variant="success" size="sm">New</Badge>
            </div>
            <p className="text-sm text-ordino-text-muted">
              New path covering two-factor authentication flow with SMS/TOTP verification
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Phase 2: Draft Test Cases with Automation Feasibility
  const renderPhase2 = (isCompleted: boolean) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {isCompleted ? (
          <CheckCircle size={20} className="text-ordino-success" />
        ) : (
          <FileText size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Test Case Drafting Complete' : 'Drafting test cases with automation feasibility...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
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
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-ordino-text">Drafted Test Cases</h4>
          <Badge variant="primary">
            Overall Score: {automationFeasibility.overallScore}%
          </Badge>
        </div>

        {draftedTestCases.map((testCase, index) => {
          const feasibility = automationFeasibility.testCases.find(
            (tc) => tc.testCaseId === testCase.id
          );
          const isExpanded = expandedTestCases.has(testCase.id);

          if (!feasibility) return null;

          return (
            <motion.div
              key={testCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`rounded-xl border overflow-hidden ${getFeasibilityBg(feasibility.feasibilityScore)}`}
            >
              {/* Header - Always visible */}
              <button
                onClick={() => toggleTestCase(testCase.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex-1 text-left">
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
                    <span className={`text-sm font-bold ${getFeasibilityColor(feasibility.feasibilityScore)}`}>
                      {feasibility.feasibilityScore}%
                    </span>
                  </div>
                  <h5 className="font-medium text-ordino-text text-sm">{testCase.title}</h5>
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} className="text-ordino-text-muted" />
                ) : (
                  <ChevronDown size={18} className="text-ordino-text-muted" />
                )}
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-ordino-border/50">
                      <p className="text-xs text-ordino-text-muted py-3">{testCase.description}</p>

                      {/* Automation Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-ordino-border/30">
                        <div>
                          <p className="text-xs text-ordino-text-muted mb-1">ROI</p>
                          <Badge variant={getROIVariant(feasibility.estimatedROI)} size="sm">
                            {feasibility.estimatedROI}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-ordino-text-muted mb-1">Complexity</p>
                          <span className="text-xs text-ordino-text">{feasibility.complexity}</span>
                        </div>
                        <div>
                          <p className="text-xs text-ordino-text-muted mb-1">Maintenance</p>
                          <span className="text-xs text-ordino-text">{feasibility.maintenanceRisk}</span>
                        </div>
                        <div>
                          <p className="text-xs text-ordino-text-muted mb-1">Framework</p>
                          <span className="text-xs text-ordino-text">{feasibility.recommendedFramework}</span>
                        </div>
                      </div>

                      {/* Browser Support */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-ordino-border/30">
                        <Chrome size={14} className="text-ordino-text-muted" />
                        <span className="text-xs text-ordino-text-muted">
                          {feasibility.browserCompatibility.join(', ')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
    </motion.div>
  );

  // Phase 3: Traceability Matrix
  const renderPhase3 = (isCompleted: boolean) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {isCompleted ? (
          <CheckCircle size={20} className="text-ordino-success" />
        ) : (
          <Link size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Traceability Analysis Complete' : 'Building requirements traceability matrix...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
      </div>

      <TraceabilityMatrix matrix={traceabilityMatrix} testCases={draftedTestCases} />
    </motion.div>
  );

  // Phase 4: Coverage Analysis
  const renderPhase4 = (isCompleted: boolean) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {isCompleted ? (
          <CheckCircle size={20} className="text-ordino-success" />
        ) : (
          <BarChart3 size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Coverage Analysis Complete' : 'Analyzing test coverage...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
      </div>

      <CoverageAnalysis
        requirementCoverage={coverageAnalysis.requirementCoverage}
        overallCoverage={coverageAnalysis.overallCoverage}
        gaps={coverageAnalysis.gaps}
      />

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
      >
        <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-ordino-text-muted">
          Test design draft complete with {draftedTestCases.length} test cases. Ready for peer and lead review.
        </p>
      </motion.div>
    </motion.div>
  );

  // Determine which phases should be visible
  const shouldShowPhase = (phaseIndex: number) => {
    if (phaseIndex === 0) return true;
    if (phaseIndex === currentPhase) return true;
    if (completedPhases.has(phaseIndex - 1)) return true;
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Draft Test Design</h3>
          <p className="text-sm text-ordino-text-muted">
            Drafting test design with scenarios, paths, test cases, and coverage analysis
          </p>
        </div>
      </div>

      {/* Phase Progress Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-2 bg-ordino-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ordino-primary to-ordino-secondary"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentPhase + phaseProgress / 100) / 4) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="text-xs text-ordino-text-muted">
          Phase {currentPhase + 1} of 4
        </span>
      </div>

      {/* Phase Content */}
      <div className="space-y-6">
        {/* Phase 1: Test Design Draft */}
        {shouldShowPhase(0) && (
          <div>
            {renderPhase1(completedPhases.has(0))}
            {completedPhases.has(0) && currentPhase > 0 && (
              <div className="my-6 border-t border-ordino-border"></div>
            )}
          </div>
        )}

        {/* Phase 2: Test Case Drafting */}
        {shouldShowPhase(1) && (
          <div>
            {renderPhase2(completedPhases.has(1))}
            {completedPhases.has(1) && currentPhase > 1 && (
              <div className="my-6 border-t border-ordino-border"></div>
            )}
          </div>
        )}

        {/* Phase 3: Traceability Matrix */}
        {shouldShowPhase(2) && (
          <div>
            {renderPhase3(completedPhases.has(2))}
            {completedPhases.has(2) && currentPhase > 2 && (
              <div className="my-6 border-t border-ordino-border"></div>
            )}
          </div>
        )}

        {/* Phase 4: Coverage Analysis */}
        {shouldShowPhase(3) && (
          <div>
            {renderPhase4(completedPhases.has(3))}
          </div>
        )}
      </div>
    </div>
  );
}
