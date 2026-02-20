import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, CheckCircle, Code, Loader2 } from 'lucide-react';
import { Badge } from '../../../common';
import { draftedTestCases } from '../../../../data/mockData';

export function FilterTestCases() {
  const [isFiltering, setIsFiltering] = useState(true);
  const [filteredCount, setFilteredCount] = useState(0);
  const [visibleTestCases, setVisibleTestCases] = useState<string[]>([]);

  // Filter test cases marked for automation
  const automationTestCases = draftedTestCases.filter(tc => tc.testingMethod === 'automation');

  useEffect(() => {
    // Simulate filtering process
    const filterTimer = setTimeout(() => {
      setIsFiltering(false);
      setFilteredCount(automationTestCases.length);
    }, 2000);

    // Reveal test cases one by one
    automationTestCases.forEach((tc, index) => {
      setTimeout(() => {
        setVisibleTestCases(prev => [...prev, tc.id]);
      }, 2500 + index * 500);
    });

    return () => clearTimeout(filterTimer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Filtering status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden"
      >
        <div className="bg-ordino-card px-6 py-4 border-b border-ordino-border">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isFiltering ? 'bg-ordino-primary/20' : 'bg-ordino-success/20'
            )}>
              {isFiltering ? (
                <Loader2 size={20} className="text-ordino-primary animate-spin" />
              ) : (
                <CheckCircle size={20} className="text-ordino-success" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-ordino-text">
                {isFiltering ? 'Filtering Test Cases...' : 'Filtering Complete'}
              </h3>
              <p className="text-sm text-ordino-text-muted">
                {isFiltering
                  ? 'Identifying test cases marked for automation'
                  : `Found ${filteredCount} test cases marked for automation`
                }
              </p>
            </div>
          </div>
        </div>

        {!isFiltering && (
          <div className="p-6">
            <div className="flex items-center gap-4 text-sm text-ordino-text-muted">
              <div className="flex items-center gap-2">
                <span className="font-medium text-ordino-text">Total Test Cases:</span>
                <span>{draftedTestCases.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-ordino-primary" />
                <span className="font-medium text-ordino-text">Filter:</span>
                <Badge variant="primary" size="sm">testingMethod = "automation"</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Code size={14} className="text-ordino-success" />
                <span className="font-medium text-ordino-text">Selected:</span>
                <span className="text-ordino-success font-semibold">{filteredCount}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Filtered test cases */}
      {!isFiltering && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
            Test Cases for Automation
          </h4>

          <AnimatePresence>
            {automationTestCases.map((testCase) => (
              visibleTestCases.includes(testCase.id) && (
                <motion.div
                  key={testCase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-ordino-card rounded-lg border border-ordino-border p-4 hover:border-ordino-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono text-ordino-primary">{testCase.id}</span>
                        <Badge variant="primary" size="sm">
                          <Code size={12} />
                          Automation
                        </Badge>
                        <Badge variant={testCase.priority === 'High' ? 'error' : testCase.priority === 'Medium' ? 'warning' : 'info'} size="sm">
                          {testCase.priority}
                        </Badge>
                      </div>
                      <h5 className="text-sm font-medium text-ordino-text mb-1">
                        {testCase.title}
                      </h5>
                      <p className="text-xs text-ordino-text-muted">
                        {testCase.categorizationReason}
                      </p>
                    </div>
                    <CheckCircle size={20} className="text-ordino-success flex-shrink-0" />
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// Helper function for className
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
