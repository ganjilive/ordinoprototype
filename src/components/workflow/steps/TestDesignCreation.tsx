import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, FileText, GitBranch } from 'lucide-react';
import { testDesign, draftedTestCases } from '../../../data/mockData';

const creationTasks = [
  {
    id: 1,
    name: 'Creating Test Design Version',
    description: `Creating version ${testDesign.version} with updated paths`,
    icon: GitBranch,
    duration: 2000,
  },
  {
    id: 2,
    name: 'Creating Test Cases',
    description: `Creating ${draftedTestCases.length} new test cases`,
    icon: FileText,
    duration: 3000,
  },
];

export function TestDesignCreation() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    creationTasks.forEach((task, index) => {
      setTimeout(() => {
        setCompletedTasks((prev) => [...prev, task.id]);
      }, index === 0 ? 1000 : creationTasks[index - 1].duration + 1000);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-secondary/20 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(59, 130, 246, 0.4)',
              '0 0 20px 10px rgba(59, 130, 246, 0)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={32} className="text-ordino-secondary" />
          </motion.div>
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">Creating Test Design & Test Cases</h3>
        <p className="text-sm text-ordino-text-muted">Creating approved test design and test cases</p>
      </div>

      {/* Creation Tasks */}
      <div className="max-w-md mx-auto space-y-4">
        {creationTasks.map((task) => {
          const Icon = task.icon;
          const isComplete = completedTasks.includes(task.id);

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
            >
              <div className="flex items-center gap-4">
                {/* Task icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isComplete ? 'bg-ordino-success/20' : 'bg-ordino-card'
                }`}>
                  <Icon size={24} className={isComplete ? 'text-ordino-success' : 'text-ordino-text-muted'} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-ordino-text">{task.name}</span>
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircle size={20} className="text-ordino-success" />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 size={20} className="text-ordino-secondary" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-ordino-text-muted mb-2">
                    {task.description}
                  </p>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-ordino-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${isComplete ? 'bg-ordino-success' : 'bg-ordino-secondary'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: isComplete ? '100%' : '60%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      {completedTasks.length === creationTasks.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-md mx-auto"
        >
          <CheckCircle size={32} className="text-ordino-success mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-ordino-success mb-2">Creation Complete!</h4>
          <div className="space-y-2 text-sm text-ordino-text-muted">
            <div>Test Design Version {testDesign.version} created</div>
            <div>{draftedTestCases.length} test cases created</div>
            <div className="mt-3 pt-3 border-t border-ordino-success/20">
              <div className="text-xs text-ordino-text-muted">
                Test Cases: {draftedTestCases.map(tc => tc.id).join(', ')}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
