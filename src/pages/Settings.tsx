import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import { IntegrationRow, ProjectConfig, toolConfigs } from '../components/settings';
import { Button, Modal } from '../components/common';
import { connectedTools } from '../data/mockData';
import { staggerContainerVariants, slideUpVariants } from '../utils/animations';
import type { ConnectedTool } from '../types';

const CATEGORY_ORDER: { key: string; label: string }[] = [
  { key: 'collaboration', label: 'Collaboration & docs' },
  { key: 'test-management', label: 'Test management' },
  { key: 'development', label: 'Development & issue tracking' },
  { key: 'cicd-communication', label: 'CI/CD & communication' },
  { key: 'design', label: 'Design' },
  { key: 'test-automation', label: 'Test automation & accessibility' },
  { key: 'other', label: 'Other' },
];

function getToolsByCategory(tools: ConnectedTool[]) {
  const byCategory = new Map<string, ConnectedTool[]>();
  for (const tool of tools) {
    const cat = tool.category ?? 'other';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(tool);
  }
  return byCategory;
}

function getToolDescription(tool: ConnectedTool): string {
  return toolConfigs[tool.name]?.description ?? `Connect to ${tool.name}.`;
}

export function Settings() {
  const [browseCategory, setBrowseCategory] = useState<string | null>(null);

  const byCategory = useMemo(() => getToolsByCategory(connectedTools), []);

  const categoriesToRender = CATEGORY_ORDER.filter((c) => byCategory.has(c.key) && byCategory.get(c.key)!.length > 0);
  const browseTools = browseCategory ? byCategory.get(browseCategory) ?? [] : [];
  const browseLabel = browseCategory ? CATEGORY_ORDER.find((c) => c.key === browseCategory)?.label ?? browseCategory : '';

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Integrations by category */}
      <motion.div variants={slideUpVariants}>
        <h2 className="text-lg font-semibold text-ordino-text mb-6">Integrations</h2>
        {categoriesToRender.map(({ key, label }) => {
          const tools = byCategory.get(key) ?? [];
          return (
            <div key={key} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-ordino-text">{label}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBrowseCategory(key)}
                  className="text-ordino-secondary hover:text-ordino-primary"
                >
                  <List size={14} className="mr-1.5" />
                  Browse all integrations
                </Button>
              </div>
              <div className="flex flex-col gap-1.5">
                {tools.map((tool) => (
                  <IntegrationRow key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Browse all modal (per category) */}
      <Modal
        isOpen={browseCategory !== null}
        onClose={() => setBrowseCategory(null)}
        title={browseLabel ? `All integrations: ${browseLabel}` : 'Integrations'}
        size="lg"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {browseTools.map((tool) => (
            <div
              key={tool.id}
              className="p-3 rounded-lg bg-ordino-bg border border-ordino-border hover:border-ordino-primary/30 transition-colors"
            >
              <p className="font-medium text-ordino-text">{tool.name}</p>
              <p className="text-sm text-ordino-text-muted mt-1">{getToolDescription(tool)}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-ordino-text-muted mt-4">
          Use Connect or Configure from the menu for each integration to set up.
        </p>
      </Modal>

      {/* Project Configuration */}
      <motion.div variants={slideUpVariants}>
        <h2 className="text-lg font-semibold text-ordino-text mb-4">Project Settings</h2>
        <ProjectConfig />
      </motion.div>
    </motion.div>
  );
}
