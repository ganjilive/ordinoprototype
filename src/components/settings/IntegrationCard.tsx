import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { Card, Button, Modal, Badge } from '../common';
import type { ConnectedTool } from '../../types';

interface IntegrationCardProps {
  tool: ConnectedTool;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const toolConfigs: Record<string, { fields: string[]; description: string }> = {
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
};

export function IntegrationCard({ tool, onConnect, onDisconnect }: IntegrationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const config = toolConfigs[tool.name] || { fields: [], description: '' };

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

        <div className="pt-2">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-ordino-bg flex items-center justify-center text-ordino-text font-bold text-lg">
                {tool.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-ordino-text">{tool.name}</h3>
                <Badge
                  variant={
                    tool.status === 'connected' ? 'success' :
                    tool.status === 'syncing' ? 'warning' : 'default'
                  }
                  size="sm"
                >
                  {tool.status === 'connected' ? 'Connected' :
                   tool.status === 'syncing' ? 'Syncing...' : 'Not Connected'}
                </Badge>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-lg text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-bg transition-colors"
            >
              <Settings size={18} />
            </button>
          </div>

          <p className="text-sm text-ordino-text-muted mb-4">
            {config.description}
          </p>

          {tool.status === 'connected' ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-ordino-text-muted">
                Last sync: {tool.lastSync ? new Date(tool.lastSync).toLocaleString() : 'Never'}
              </span>
              <Button variant="ghost" size="sm" onClick={onDisconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsModalOpen(true)} className="w-full">
              Connect {tool.name}
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
