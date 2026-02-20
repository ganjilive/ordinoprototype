import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { Card, Button, Modal, Badge } from '../common';
import type { ConnectedTool } from '../../types';

interface IntegrationCardProps {
  tool: ConnectedTool;
  onConnect?: () => void;
  onDisconnect?: () => void;
  compact?: boolean;
}

export const toolConfigs: Record<string, { fields: string[]; description: string }> = {
  Jira: {
    fields: ['API URL', 'API Token', 'Project Key'],
    description: 'Connect to Jira to automatically detect requirements and sync test cases.',
  },
  GitHub: {
    fields: ['Repository URL', 'Access Token', 'Branch'],
    description: 'Connect to GitHub to create PRs for test automation scripts.',
  },
  Figma: {
    fields: ['Team ID', 'Access Token'],
    description: 'Connect to Figma to detect UI changes and generate visual test cases.',
  },
  TestRail: {
    fields: ['API URL', 'Username', 'API Key', 'Project ID'],
    description: 'Connect to TestRail to sync test plans and results.',
  },
  Slack: {
    fields: ['Workspace', 'Bot Token', 'Default Channel'],
    description: 'Connect to Slack to send notifications to your team.',
  },
  Confluence: {
    fields: ['Base URL', 'API Token', 'Space Key'],
    description: 'Connect to Confluence to sync requirements and test documentation.',
  },
  'Microsoft Teams': {
    fields: ['Tenant ID', 'Bot ID', 'Bot Secret'],
    description: 'Connect to Microsoft Teams to send test alerts and reports.',
  },
  Sharepoint: {
    fields: ['Site URL', 'Client ID', 'Client Secret'],
    description: 'Connect to SharePoint to sync test artifacts and reports.',
  },
  Notion: {
    fields: ['Integration Token', 'Database ID'],
    description: 'Connect to Notion to sync test plans and documentation.',
  },
  'Monday.com': {
    fields: ['API Token', 'Board ID'],
    description: 'Connect to Monday.com to track test execution and defects.',
  },
  Mural: {
    fields: ['API Token', 'Workspace ID'],
    description: 'Connect to Mural to link test scenarios to collaboration boards.',
  },
  Lucid: {
    fields: ['API Key', 'API Secret'],
    description: 'Connect to Lucid to sync diagrams and test flow documentation.',
  },
  Testmo: {
    fields: ['Server URL', 'API Token', 'Project ID'],
    description: 'Connect to Testmo to sync test cases and execution results.',
  },
  'Zephyr Scale': {
    fields: ['Jira URL', 'API Token', 'Project Key'],
    description: 'Connect to Zephyr Scale to sync test cycles and results.',
  },
  Jenkins: {
    fields: ['Jenkins URL', 'Username', 'API Token'],
    description: 'Connect to Jenkins to trigger test runs and sync build status.',
  },
  'VS Code Extension': {
    fields: ['Ordino API Key', 'Workspace ID'],
    description: 'Connect the VS Code extension to sync coverage and run tests from the editor.',
  },
  'Selenium IDE': {
    fields: ['Export Path', 'Project Key'],
    description: 'Connect Selenium IDE to import and run recorded tests with Ordino.',
  },
  Deque: {
    fields: ['API URL', 'API Key'],
    description: 'Connect to Deque to sync accessibility test results and axe reports.',
  },
  Cucumber: {
    fields: ['Features Path', 'Project ID'],
    description: 'Connect Cucumber to sync Gherkin scenarios and step definitions.',
  },
  Cypress: {
    fields: ['Project ID', 'Record Key'],
    description: 'Connect Cypress to sync test runs and dashboard results.',
  },
  Zelenium: {
    fields: ['API URL', 'API Key'],
    description: 'Connect Zelenium to sync Selenium-based test execution data.',
  },
  testRigor: {
    fields: ['API URL', 'API Token'],
    description: 'Connect testRigor to sync end-to-end test results and coverage.',
  },
};

export function IntegrationCard({ tool, onConnect, onDisconnect, compact }: IntegrationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const config = toolConfigs[tool.name] ?? {
    fields: ['API URL', 'API Key'],
    description: `Connect to ${tool.name}.`,
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    // Simulate connection test
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
    }, 2000);
  };

  const handleConnect = () => {
    setIsModalOpen(false);
    onConnect?.();
  };

  return (
    <>
      <Card hover className="relative overflow-hidden">
        {/* Status indicator */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          tool.status === 'connected' ? 'bg-ordino-success' :
          tool.status === 'syncing' ? 'bg-ordino-warning' :
          'bg-ordino-text-muted'
        }`} />

        <div className={compact ? 'pt-1.5 pb-1.5 px-2' : 'pt-2'}>
          <div className={`flex items-start justify-between ${compact ? 'mb-2' : 'mb-4'}`}>
            <div className="flex items-center gap-2">
              <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} rounded-lg bg-ordino-bg flex items-center justify-center text-ordino-text font-bold ${compact ? 'text-sm' : 'text-lg'}`}>
                {tool.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-ordino-text ${compact ? 'text-xs truncate' : ''}`}>{tool.name}</h3>
                <Badge
                  variant={
                    tool.status === 'connected' ? 'success' :
                    tool.status === 'syncing' ? 'warning' : 'default'
                  }
                  size="sm"
                  className={compact ? '!text-[10px] !px-1.5 !py-0' : ''}
                >
                  {tool.status === 'connected' ? 'Connected' :
                   tool.status === 'syncing' ? 'Syncing...' : 'Not Connected'}
                </Badge>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`rounded-lg text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-bg transition-colors ${compact ? 'p-1' : 'p-2'}`}
            >
              <Settings size={compact ? 14 : 18} />
            </button>
          </div>

          {!compact && (
            <p className="text-sm text-ordino-text-muted mb-4">
              {config.description}
            </p>
          )}

          {tool.status === 'connected' ? (
            <div className={`flex items-center justify-between ${compact ? 'mt-1.5' : ''}`}>
              <span className={`text-ordino-text-muted ${compact ? 'text-[10px] truncate flex-1 mr-2' : 'text-xs'}`}>
                {compact ? (tool.lastSync ? 'Synced' : 'Never') : (tool.lastSync ? `Last sync: ${new Date(tool.lastSync).toLocaleString()}` : 'Never')}
              </span>
              <Button variant="ghost" size={compact ? 'sm' : 'sm'} onClick={onDisconnect} className={compact ? 'text-[10px] px-2 py-0.5' : ''}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsModalOpen(true)} className={`w-full ${compact ? 'text-xs py-1.5' : ''}`} size={compact ? 'sm' : 'md'}>
              Connect {compact ? '' : tool.name}
            </Button>
          )}
        </div>
      </Card>

      {/* Setup Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configure ${tool.name}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-ordino-text-muted">{config.description}</p>

          {/* Form fields */}
          <div className="space-y-3">
            {config.fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-ordino-text mb-1">
                  {field}
                </label>
                <input
                  type={field.toLowerCase().includes('token') || field.toLowerCase().includes('key') ? 'password' : 'text'}
                  placeholder={`Enter ${field.toLowerCase()}`}
                  className="w-full px-3 py-2 bg-ordino-bg border border-ordino-border rounded-lg text-sm text-ordino-text placeholder:text-ordino-text-muted focus:outline-none focus:border-ordino-primary transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Test result */}
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                testResult === 'success' ? 'bg-ordino-success/10 text-ordino-success' : 'bg-ordino-error/10 text-ordino-error'
              }`}
            >
              {testResult === 'success' ? <Check size={16} /> : <X size={16} />}
              <span className="text-sm">
                {testResult === 'success' ? 'Connection successful!' : 'Connection failed'}
              </span>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={handleTestConnection} disabled={isTesting} className="flex-1">
              {isTesting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            <Button onClick={handleConnect} className="flex-1" disabled={testResult !== 'success'}>
              Save & Connect
            </Button>
          </div>

          {/* Help link */}
          <a
            href="#"
            className="flex items-center justify-center gap-1 text-xs text-ordino-secondary hover:underline"
          >
            View setup documentation
            <ExternalLink size={12} />
          </a>
        </div>
      </Modal>
    </>
  );
}
