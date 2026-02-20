// Metrics types
export interface Metric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  icon: string;
}

// Activity types
export interface Activity {
  id: string;
  action: string;
  target: string;
  tool: 'jira' | 'github' | 'figma' | 'testrail' | 'slack';
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

// Connected tool types
export interface ConnectedTool {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync?: Date;
  category?: string;
}

// Workflow types
export type WorkflowStepStatus = 'pending' | 'active' | 'completed';

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: WorkflowStepStatus;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// History types
export interface HistoryEntry {
  id: string;
  action: string;
  category: 'test-generation' | 'gap-analysis' | 'notification' | 'sync';
  status: 'success' | 'pending' | 'failed';
  timestamp: Date;
  details: {
    requirement?: string;
    testCases?: string[];
    gaps?: string[];
    recipients?: string[];
  };
}

// Traceability types
export interface TraceabilityNode {
  id: string;
  type: 'requirement' | 'test-plan' | 'test-case';
  title: string;
  status: 'passed' | 'failed' | 'pending' | 'not-run';
  children?: TraceabilityNode[];
}

// Integration settings types
export interface IntegrationConfig {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
  config: Record<string, string>;
}

// Chart data types
export interface TrendDataPoint {
  date: string;
  coverage: number;
  passRate: number;
  automation: number;
}

// Enhanced Workflow Types
export interface Gap {
  id: number;
  type: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface Dependency {
  id: number;
  name: string;
  status: 'Available' | 'In Progress' | 'Blocked';
}

export interface RiskFlag {
  type: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface TriageAnalysis {
  requirementId: string;
  completenessScore: number;
  testabilityLevel: 'High' | 'Medium' | 'Low';
  gaps: Gap[];
  dependencies: Dependency[];
  riskFlags: RiskFlag[];
  estimatedTestingEffort: string;
  recommendedApproach: string;
}

export interface ApprovalChainEntry {
  id: number;
  role: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  order: number;
  timestamp?: Date;
}

export interface ApprovalHistoryEntry {
  id: string;
  stepId: number;
  approver: string;
  action: 'approved' | 'rejected' | 'revision';
  timestamp: Date;
  comments?: string;
}

export interface TestCaseFeasibility {
  testCaseId: string;
  feasibilityScore: number;
  recommendedFramework: string;
  browserCompatibility: string[];
  estimatedROI: 'High' | 'Medium' | 'Low';
  complexity: 'High' | 'Medium' | 'Low';
  maintenanceRisk: 'High' | 'Medium' | 'Low';
}

export interface FrameworkRecommendation {
  primary: string;
  alternative: string;
  reasoning: string;
}

export interface AutomationFeasibility {
  overallScore: number;
  testCases: TestCaseFeasibility[];
  frameworkRecommendation: FrameworkRecommendation;
}

export interface DataRequirement {
  entity: string;
  volume: string;
  type: string;
}

export interface TestDataStrategy {
  requirements: DataRequirement[];
  generationStrategy: string;
  privacyCompliance: string[];
  dataRefreshFrequency: string;
  setupScripts: string[];
  teardownScripts: string[];
  dependencies: string[];
}

export interface Blocker {
  id: string;
  type: 'Ambiguous Requirement' | 'Missing Dependency' | 'Resource Unavailable';
  description: string;
  impact: string;
  owner: string;
  status: 'Active' | 'Escalated' | 'Resolved';
  createdAt: Date;
  escalationLevel: number;
  estimatedResolutionTime: string;
}

export interface RevisionRequest {
  id: string;
  stepId: number;
  category: string;
  comments: string;
  severity: 'Minor' | 'Major' | 'Blocker';
  requestedBy: string;
  requestedAt: Date;
}

export interface EscalationChainEntry {
  level: number;
  role: string;
  name: string;
  slaHours: number;
  status: 'pending' | 'current' | 'completed';
}

export interface CommunicationLogEntry {
  id: number;
  timestamp: Date;
  from: string;
  to: string;
  channel: 'slack' | 'email';
  message: string;
}

// Test Execution Demo Types
export interface TestExecution {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  errorMessage?: string;
}

export interface BugReport {
  id: string;
  jiraKey: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  linkedTestId: string;
  status: 'created' | 'open' | 'in-progress';
}

export interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration?: number;
}

export interface ExecutionChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// RCA Demo Types
export interface FailingBuild {
  buildNumber: number;
  commitHash: string;
  failedTest: string;
  errorMessage: string;
  timestamp: string;
}

export interface RCAAnalysisStep {
  id: string;
  label: string;
  finding: string;
  type: 'error' | 'warning' | 'info';
}

export interface SlackMessage {
  id: string;
  channel: string;
  recipient: string;
  message: string;
}

export interface HumanResponse {
  id: string;
  from: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface RootCauseEntry {
  title: string;
  detail: string;
}

export interface ImpactEntry {
  label: string;
  value: string;
}

export interface ResolutionStep {
  id: number;
  action: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface FiveWhysEntry {
  why: string;
  answer: string;
}

export interface RCAReport {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  problemStatement: string;
  timeline: TimelineEvent[];
  rootCause: RootCauseEntry;
  contributingFactors: string[];
  resolutionSteps: ResolutionStep[];
  preventionRecommendations: string[];
  fiveWhys: FiveWhysEntry[];
}

export interface RCAStakeholderNotification {
  id: number;
  channel: string;
  icon: string;
  recipient: string;
  message: string;
  color: string;
}

export interface RCATimeMetric {
  manual: number;
  ordino: number;
}

// Auto-Heal Demo Types
export type AutoHealStepStatus = 'pending' | 'active' | 'completed';

export interface AutoHealWorkflowState {
  currentStep: number;
  steps: {
    id: number;
    status: AutoHealStepStatus;
  }[];
  isPlaying: boolean;
  isComplete: boolean;
  healingApproved: boolean;
}

export interface AutoHealTimeMetric {
  manual: number;
  ordino: number;
}

// Platform Integration Demo Types

export interface PlatformChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  authorName?: string;
  authorType?: 'human' | 'bot' | 'system';
}

// Slack types
export interface SlackFailingTest {
  id: string;
  name: string;
  error: string;
}

export interface SlackCIAlertData {
  buildNumber: number;
  commitHash: string;
  commitAuthor: string;
  branch: string;
  failingTests: SlackFailingTest[];
  coverageBefore: number;
  coverageAfter: number;
  jiraTicket: string;
}

export interface SlackChannelMessage {
  id: string;
  authorName: string;
  authorType: 'human' | 'bot' | 'system';
  content: string;
  timestamp: string;
  isAlert?: boolean;
}

// Teams types
export interface TeamsFailureEntry {
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  isBlocking: boolean;
}

export interface TeamsReportData {
  sprintName: string;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  coverage: number;
  passRate: number;
  topFailures: TeamsFailureEntry[];
}

export interface TeamsChannelMessage {
  id: string;
  authorName: string;
  authorType: 'human' | 'bot' | 'system';
  content: string;
  timestamp: string;
  isReport?: boolean;
}

// Jira types
export interface JiraChildIssue {
  key: string;
  summary: string;
  status: string;
  type: 'Test' | 'Sub-task' | 'Bug';
}

export interface JiraComment {
  id: string;
  authorName: string;
  authorType: 'human' | 'bot';
  content: string;
  timestamp: string;
}

export interface JiraIssue {
  key: string;
  summary: string;
  type: 'Bug' | 'Story' | 'Task' | 'Epic';
  status: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  reporter: string;
  assignee: string;
  labels: string[];
  sprint: string;
  storyPoints: number;
  description: string;
  comments: JiraComment[];
  childIssues: JiraChildIssue[];
}

// VS Code types
export type CoverageStatus = 'covered' | 'uncovered' | 'partial' | 'none';

export interface VSCodeToken {
  text: string;
  color: string;
}

export interface VSCodeLine {
  lineNumber: number;
  tokens: VSCodeToken[];
  coverageStatus: CoverageStatus;
}

export interface UncoveredFunction {
  name: string;
  startLine: number;
  endLine: number;
  reason: string;
}

export interface VSCodeCoverage {
  overall: number;
  functions: number;
  branches: number;
  uncoveredFunctions: UncoveredFunction[];
}
