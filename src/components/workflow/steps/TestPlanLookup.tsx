import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, CheckCircle, AlertTriangle, FileSpreadsheet as FileExcel, File, GitBranch, Database, FlaskConical, ChevronDown, ChevronUp, Target, List, BookOpen, CheckCircle2, XCircle, AlertCircle, Info, Link, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '../../common';
import { testPlan, testDesign, existingTestCases, draftedTestCases, traceabilityMatrix, coverageAnalysis } from '../../../data/mockData';
import { TraceabilityMatrix } from './TraceabilityMatrix';
import { CoverageAnalysis } from './CoverageAnalysis';

interface ExpandableSectionProps {
  title: string;
  icon: LucideIcon;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function ExpandableSection({ title, icon: Icon, isExpanded, onToggle, children }: ExpandableSectionProps) {
  return (
    <div className="border border-ordino-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-ordino-card transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-ordino-primary" />
          <span className="text-sm font-medium text-ordino-text">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-ordino-text-muted" />
        ) : (
          <ChevronDown size={16} className="text-ordino-text-muted" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 border-t border-ordino-border">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TestPlanLookup() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setPhaseProgress((prev) => {
        if (prev >= 100) {
          if (currentPhase < 5) {
            // Mark current phase as completed before moving to next
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
          <Search size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Test Plan Lookup Complete' : 'Looking up existing test plan...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
      </div>

      {!isCompleted && (
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <FileExcel size={24} className="text-ordino-primary" />
          </motion.div>
          <span className="text-sm text-ordino-text-muted">Searching for test plan document...</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} className="text-ordino-primary" />
          <h3 className="text-lg font-semibold text-ordino-text">Test Plan Found</h3>
          <Badge variant="success" size="sm">v{testPlan.version}</Badge>
          <div className="ml-auto flex items-center gap-2">
            <Info size={16} className="text-ordino-text-muted" />
            <span className="text-xs text-ordino-text-muted">IEEE 829 / ISTQB Compliant</span>
          </div>
        </div>

        {/* Summary Section - Always Visible */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-ordino-text-muted">Automation Target</span>
              <p className="text-sm font-medium text-ordino-text">{testPlan.automationPercentageTarget}%</p>
            </div>
            <div>
              <span className="text-xs text-ordino-text-muted">Integration Tests</span>
              <p className="text-sm font-medium text-ordino-text">
                {testPlan.integrationTestRequired ? 'Required' : 'Not Required'}
              </p>
            </div>
            <div>
              <span className="text-xs text-ordino-text-muted">DB Verification</span>
              <p className="text-sm font-medium text-ordino-text">
                {testPlan.databaseVerificationRequired ? 'Required' : 'Not Required'}
              </p>
            </div>
            <div>
              <span className="text-xs text-ordino-text-muted">Test Items</span>
              <p className="text-sm font-medium text-ordino-text">{testPlan.testItems?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3">
          {/* Test Objectives */}
          <ExpandableSection
            title="Test Objectives"
            icon={Target}
            isExpanded={expandedSections.has('objectives')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('objectives')) {
                newSet.delete('objectives');
              } else {
                newSet.add('objectives');
              }
              setExpandedSections(newSet);
            }}
          >
            <ul className="space-y-2">
              {testPlan.testObjectives?.map((objective, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                  <span className="text-ordino-text">{objective}</span>
                </li>
              ))}
            </ul>
          </ExpandableSection>

          {/* Test Scope */}
          <ExpandableSection
            title="Test Scope"
            icon={Target}
            isExpanded={expandedSections.has('scope')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('scope')) {
                newSet.delete('scope');
              } else {
                newSet.add('scope');
              }
              setExpandedSections(newSet);
            }}
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} className="text-ordino-success" />
                  <span className="text-sm font-medium text-ordino-text">In Scope</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {testPlan.testScope?.inScope.map((item, index) => (
                    <li key={index} className="text-xs text-ordino-text-muted">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={14} className="text-ordino-text-muted" />
                  <span className="text-sm font-medium text-ordino-text">Out of Scope</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {testPlan.testScope?.outOfScope.map((item, index) => (
                    <li key={index} className="text-xs text-ordino-text-muted">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </ExpandableSection>

          {/* Test Items */}
          <ExpandableSection
            title="Test Items"
            icon={List}
            isExpanded={expandedSections.has('items')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('items')) {
                newSet.delete('items');
              } else {
                newSet.add('items');
              }
              setExpandedSections(newSet);
            }}
          >
            <ul className="space-y-2">
              {testPlan.testItems?.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <FileText size={14} className="text-ordino-text-muted" />
                  <span className="text-ordino-text">{item}</span>
                </li>
              ))}
            </ul>
          </ExpandableSection>

          {/* Test Approach */}
          <ExpandableSection
            title="Test Approach"
            icon={BookOpen}
            isExpanded={expandedSections.has('approach')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('approach')) {
                newSet.delete('approach');
              } else {
                newSet.add('approach');
              }
              setExpandedSections(newSet);
            }}
          >
            <p className="text-sm text-ordino-text-muted">{testPlan.testApproach}</p>
          </ExpandableSection>

          {/* Pass/Fail Criteria */}
          <ExpandableSection
            title="Pass/Fail Criteria"
            icon={CheckCircle2}
            isExpanded={expandedSections.has('criteria')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('criteria')) {
                newSet.delete('criteria');
              } else {
                newSet.add('criteria');
              }
              setExpandedSections(newSet);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} className="text-ordino-success" />
                  <span className="text-sm font-medium text-ordino-text">Pass Criteria</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {testPlan.passFailCriteria?.passCriteria.map((criteria, index) => (
                    <li key={index} className="text-xs text-ordino-text-muted">• {criteria}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={14} className="text-ordino-error" />
                  <span className="text-sm font-medium text-ordino-text">Fail Criteria</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {testPlan.passFailCriteria?.failCriteria.map((criteria, index) => (
                    <li key={index} className="text-xs text-ordino-text-muted">• {criteria}</li>
                  ))}
                </ul>
              </div>
            </div>
          </ExpandableSection>

          {/* Test Environment */}
          <ExpandableSection
            title="Test Environment"
            icon={Database}
            isExpanded={expandedSections.has('environment')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('environment')) {
                newSet.delete('environment');
              } else {
                newSet.add('environment');
              }
              setExpandedSections(newSet);
            }}
          >
            <div className="space-y-3">
              {testPlan.testEnvironment && Object.entries(testPlan.testEnvironment).map(([key, value]) => (
                <div key={key}>
                  <span className="text-xs font-medium text-ordino-text capitalize">{key}:</span>
                  <ul className="mt-1 space-y-1 ml-4">
                    {(value as string[]).map((item, index) => (
                      <li key={index} className="text-xs text-ordino-text-muted">• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ExpandableSection>

          {/* Risks */}
          <ExpandableSection
            title="Risks & Mitigation"
            icon={AlertCircle}
            isExpanded={expandedSections.has('risks')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('risks')) {
                newSet.delete('risks');
              } else {
                newSet.add('risks');
              }
              setExpandedSections(newSet);
            }}
          >
            <div className="space-y-3">
              {testPlan.risks?.map((risk, index) => (
                <div key={index} className="p-3 bg-ordino-card rounded-lg border border-ordino-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-ordino-text">{risk.risk}</span>
                    <Badge
                      variant={risk.impact === 'High' ? 'error' : risk.impact === 'Medium' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {risk.impact}
                    </Badge>
                  </div>
                  <p className="text-xs text-ordino-text-muted">Mitigation: {risk.mitigation}</p>
                </div>
              ))}
            </div>
          </ExpandableSection>

          {/* Product Workflows */}
          <ExpandableSection
            title="Product Workflows"
            icon={GitBranch}
            isExpanded={expandedSections.has('workflows')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('workflows')) {
                newSet.delete('workflows');
              } else {
                newSet.add('workflows');
              }
              setExpandedSections(newSet);
            }}
          >
            <div className="space-y-2">
              {testPlan.workflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center gap-2 text-sm">
                  <GitBranch size={14} className="text-ordino-text-muted" />
                  <span className="text-ordino-text">{workflow.name}</span>
                  <Badge variant={workflow.priority === 'High' ? 'error' : 'default'} size="sm">
                    {workflow.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </ExpandableSection>

          {/* High-Level Test Scenarios */}
          <ExpandableSection
            title="High-Level Test Scenarios"
            icon={FlaskConical}
            isExpanded={expandedSections.has('scenarios')}
            onToggle={() => {
              const newSet = new Set(expandedSections);
              if (newSet.has('scenarios')) {
                newSet.delete('scenarios');
              } else {
                newSet.add('scenarios');
              }
              setExpandedSections(newSet);
            }}
          >
            <div className="space-y-2">
              {testPlan.highLevelScenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center gap-2 text-sm">
                  <FlaskConical size={14} className="text-ordino-text-muted" />
                  <span className="text-ordino-text">{scenario.name}</span>
                </div>
              ))}
            </div>
          </ExpandableSection>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 p-3 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-ordino-warning" />
            <span className="text-sm text-ordino-text">
              Test plan needs extension to cover new 2FA requirement
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

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
          <Database size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Test Design Analysis Complete' : 'Analyzing connected test designs...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <File size={20} className="text-ordino-primary" />
          <h3 className="text-lg font-semibold text-ordino-text">{testDesign.name}</h3>
          <Badge variant="info" size="sm">v{testDesign.version}</Badge>
        </div>

        <div className="space-y-3">
          {testDesign.paths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`p-4 rounded-lg border ${
                path.status === 'affected'
                  ? 'bg-ordino-warning/10 border-ordino-warning/30'
                  : 'bg-ordino-card border-ordino-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-ordino-text">{path.name}</span>
                {path.status === 'affected' && (
                  <Badge variant="warning" size="sm">Affected</Badge>
                )}
              </div>
              <p className="text-sm text-ordino-text-muted mb-2">{path.description}</p>
              {path.status === 'affected' && (
                <p className="text-xs text-ordino-warning">{path.affectedReason}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

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
          <Search size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Test Case Discovery Complete' : 'Finding test cases connected to affected designs...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-6"
      >
        <h3 className="text-lg font-semibold text-ordino-text mb-4">Existing Test Cases</h3>
        <div className="space-y-3">
          {existingTestCases.map((testCase, index) => (
            <motion.div
              key={testCase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="p-3 bg-ordino-card rounded-lg border border-ordino-border"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-ordino-text">{testCase.id}</span>
                <Badge
                  variant={testCase.testingMethod === 'automation' ? 'success' : 'default'}
                  size="sm"
                >
                  {testCase.testingMethod}
                </Badge>
              </div>
              <p className="text-xs text-ordino-text-muted">{testCase.title}</p>
              <p className="text-xs text-ordino-text-muted mt-1">Covers: {testCase.coverage}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

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
          <CheckCircle size={20} className="text-ordino-primary" />
        )}
        <span className="text-lg font-semibold text-ordino-text">
          {isCompleted ? 'Test Case Drafting Complete' : 'Analyzing need for new test cases...'}
        </span>
        {isCompleted && <Badge variant="success" size="sm">Complete</Badge>}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-ordino-info/10 rounded-lg border border-ordino-info/20 mb-6"
      >
        <p className="text-sm text-ordino-text">
          <strong>Judgment:</strong> {draftedTestCases.length} new test cases needed to cover authentication flow with 2FA
        </p>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ordino-text">Drafting New Test Cases</h3>
        <div className="space-y-3">
          {draftedTestCases.map((testCase, index) => {
            const methodColors = {
              automation: 'success',
              manual: 'info',
              smoke: 'warning',
              integration: 'default',
            } as const;

            return (
              <motion.div
                key={testCase.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: index * 0.2 }}
                className="p-4 bg-ordino-card rounded-lg border border-ordino-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-ordino-primary">{testCase.id}</span>
                      <Badge
                        variant={methodColors[testCase.testingMethod as keyof typeof methodColors] || 'default'}
                        size="sm"
                      >
                        {testCase.testingMethod}
                      </Badge>
                      <Badge
                        variant={testCase.priority === 'High' ? 'error' : 'warning'}
                        size="sm"
                      >
                        {testCase.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-ordino-text">{testCase.title}</p>
                    <p className="text-xs text-ordino-text-muted mt-1">{testCase.description}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-ordino-text-muted">
                  <strong>Reason:</strong> {testCase.categorizationReason}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 p-4 bg-ordino-success/10 rounded-lg border border-ordino-success/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-ordino-success" />
            <span className="text-sm font-medium text-ordino-text">Test Cases Categorized</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-ordino-text-muted">
            <div>Automation: {draftedTestCases.filter(tc => tc.testingMethod === 'automation').length}</div>
            <div>Manual: {draftedTestCases.filter(tc => tc.testingMethod === 'manual').length}</div>
            <div>Smoke: {draftedTestCases.filter(tc => tc.testingMethod === 'smoke').length}</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderPhase5 = (isCompleted: boolean) => (
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

  const renderPhase6 = (isCompleted: boolean) => (
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
    </motion.div>
  );

  // Determine which phases should be visible
  const shouldShowPhase = (phaseIndex: number) => {
    if (phaseIndex === 0) return true; // Always show phase 1
    if (phaseIndex === currentPhase) return true; // Show current active phase
    if (completedPhases.has(phaseIndex - 1)) return true; // Show if previous phase is completed
    return false;
  };

  return (
    <div className="space-y-4">
      {/* Phase Progress Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-2 bg-ordino-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ordino-primary to-ordino-secondary"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentPhase + phaseProgress / 100) / 6) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="text-xs text-ordino-text-muted">
          Phase {currentPhase + 1} of 6
        </span>
      </div>

      {/* Phase Content - Render all visible phases */}
      <div className="space-y-6">
        {/* Phase 1 */}
        {shouldShowPhase(0) && (
          <div>
            {renderPhase1(completedPhases.has(0))}
            {completedPhases.has(0) && currentPhase > 0 && (
              <div className="my-6 border-t border-ordino-border"></div>
            )}
          </div>
        )}

        {/* Phase 2 */}
        {shouldShowPhase(1) && (
          <div>
            {renderPhase2(completedPhases.has(1))}
            {completedPhases.has(1) && currentPhase > 1 && (
              <div className="my-6 border-t border-ordino-border"></div>
            )}
          </div>
        )}

        {/* Phase 3 */}
        {shouldShowPhase(2) && (
          <div>
            {renderPhase3(completedPhases.has(2))}
            {completedPhases.has(2) && currentPhase > 2 && (
              <div className="my-6 border-t border-ordino-border"></div>
            )}
          </div>
        )}

        {/* Phase 4 */}
        {shouldShowPhase(3) && (
          <div>
            {renderPhase4(completedPhases.has(3))}
            {completedPhases.has(3) && currentPhase > 3 && (
              <div className="my-6 border-t border-ordino-border"></div>
            )}
          </div>
        )}

        {/* Phase 5 - Traceability Matrix */}
        {shouldShowPhase(4) && (
          <div>
            {renderPhase5(completedPhases.has(4))}
            {completedPhases.has(4) && currentPhase > 4 && (
              <div className="my-6 border-t border-ordino-border"></div>
            )}
          </div>
        )}

        {/* Phase 6 - Coverage Analysis */}
        {shouldShowPhase(5) && (
          <div>
            {renderPhase6(completedPhases.has(5))}
          </div>
        )}
      </div>
    </div>
  );
}
