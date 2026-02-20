import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Check, X, Loader2, ExternalLink } from 'lucide-react';
import { Button, Modal } from '../common';
import { toolConfigs } from './IntegrationCard';
import type { ConnectedTool } from '../../types';

interface IntegrationRowProps {
  tool: ConnectedTool;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function IntegrationRow({ tool, onConnect, onDisconnect }: IntegrationRowProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const config = toolConfigs[tool.name] ?? {
    fields: ['API URL', 'API Key'],
    description: `Connect to ${tool.name}.`,
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
    }, 2000);
  };

  const handleConnect = () => {
    setIsModalOpen(false);
    setMenuOpen(false);
    onConnect?.();
  };

  const openConfigure = () => {
    setMenuOpen(false);
    setIsModalOpen(true);
  };

  const statusDot =
    tool.status === 'connected'
      ? 'bg-ordino-success'
      : tool.status === 'syncing'
        ? 'bg-ordino-warning'
        : 'bg-ordino-text-muted';

  return (
    <>
      <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-ordino-card border border-ordino-border hover:border-ordino-border/80 transition-colors">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-ordino-bg flex items-center justify-center text-ordino-text font-semibold text-sm shrink-0">
            {tool.name.charAt(0)}
          </div>
          <span className="text-sm font-medium text-ordino-text truncate">{tool.name}</span>
          <div className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`} title={tool.status} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {tool.status === 'connected' || tool.status === 'syncing' ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="p-1.5 rounded text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-bg transition-colors"
                aria-label="Actions"
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-1 py-1 min-w-[140px] rounded-lg bg-ordino-card border border-ordino-border shadow-lg z-10"
                >
                  <button
                    type="button"
                    onClick={openConfigure}
                    className="w-full px-3 py-2 text-left text-sm text-ordino-text hover:bg-ordino-bg transition-colors"
                  >
                    Configure
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDisconnect?.();
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-ordino-text hover:bg-ordino-bg transition-colors"
                  >
                    Disconnect
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={openConfigure}>
              Connect
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configure ${tool.name}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-ordino-text-muted">{config.description}</p>

          <div className="space-y-3">
            {config.fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-ordino-text mb-1">{field}</label>
                <input
                  type={
                    field.toLowerCase().includes('token') || field.toLowerCase().includes('key')
                      ? 'password'
                      : 'text'
                  }
                  placeholder={`Enter ${field.toLowerCase()}`}
                  className="w-full px-3 py-2 bg-ordino-bg border border-ordino-border rounded-lg text-sm text-ordino-text placeholder:text-ordino-text-muted focus:outline-none focus:border-ordino-primary transition-colors"
                />
              </div>
            ))}
          </div>

          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                testResult === 'success'
                  ? 'bg-ordino-success/10 text-ordino-success'
                  : 'bg-ordino-error/10 text-ordino-error'
              }`}
            >
              {testResult === 'success' ? <Check size={16} /> : <X size={16} />}
              <span className="text-sm">
                {testResult === 'success' ? 'Connection successful!' : 'Connection failed'}
              </span>
            </motion.div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex-1"
            >
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
