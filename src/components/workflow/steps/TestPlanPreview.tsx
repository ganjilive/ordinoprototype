import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { Badge } from '../../common';
import { generatedTestCases } from '../../../data/mockData';

export function TestPlanPreview() {
  const [visibleCases, setVisibleCases] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCases((prev) => {
        if (prev >= generatedTestCases.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-ordino-card px-4 py-3 border-b border-ordino-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-ordino-primary" />
          <span className="font-semibold text-ordino-text">Generated Test Plan</span>
        </div>
        <Badge variant="info" size="sm">
          {visibleCases} / {generatedTestCases.length} cases
        </Badge>
      </div>

      {/* Test cases with typewriter effect */}
      <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
        {generatedTestCases.map((testCase, index) => (
          <motion.div
            key={testCase.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: index < visibleCases ? 1 : 0,
              height: index < visibleCases ? 'auto' : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 p-3 bg-ordino-card rounded-lg border border-ordino-border">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: index < visibleCases ? 1 : 0 }}
                transition={{ delay: 0.2 }}
                className="w-6 h-6 rounded-full bg-ordino-success/20 flex items-center justify-center flex-shrink-0"
              >
                <Plus size={14} className="text-ordino-success" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-ordino-primary">{testCase.id}</span>
                  <Badge variant="default" size="sm">{testCase.type}</Badge>
                  <Badge
                    variant={testCase.priority === 'High' ? 'error' : testCase.priority === 'Medium' ? 'warning' : 'default'}
                    size="sm"
                  >
                    {testCase.priority}
                  </Badge>
                </div>
                <p className="text-sm text-ordino-text">{testCase.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-ordino-card border-t border-ordino-border">
        <div className="flex items-center justify-between text-xs text-ordino-text-muted">
          <span>Auto-generated based on requirement analysis</span>
          <span className="text-ordino-success">
            {visibleCases === generatedTestCases.length ? 'Complete' : 'Generating...'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
