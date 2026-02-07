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
