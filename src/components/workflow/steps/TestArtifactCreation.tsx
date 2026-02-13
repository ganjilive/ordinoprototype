import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, FileText, GitBranch, ClipboardList } from 'lucide-react';
import { testPlan, testDesign, draftedTestCases } from '../../../data/mockData';

const creationTasks = [
  {
    id: 1,
    name: 'Creating Test Plan Update',
    description: `Updating test plan v${testPlan.version} with 2FA authentication scope`,
    icon: ClipboardList,
    duration: 1500,
  },
  {
    id: 2,
    name: 'Creating Test Design Version',
    description: `Creating test design v${testDesign.version} with updated paths`,
    icon: GitBranch,
    duration: 2000,
  },
  {
    id: 3,
    name: 'Creating Test Cases',
    description: `Creating ${draftedTestCases.length} new test cases in repository`,
    icon: FileText,
    duration: 2500,
  },
];

export function TestArtifactCreation() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [currentTaskProgress, setCurrentTaskProgress] = useState<Record<number, number>>({});

  useEffect(() => {
    let cumulativeTime = 0;

    creationTasks.forEach((task) => {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setCurrentTaskProgress((prev) => {
          const current = prev[task.id] || 0;
          if (current >= 100) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [task.id]: current + 5 };
        });
      }, task.duration / 20);

      // Mark as complete
      setTimeout(() => {
        clearInterval(progressInterval);
        setCurrentTaskProgress((prev) => ({ ...prev, [task.id]: 100 }));
        setCompletedTasks((prev) => [...prev, task.id]);
      }, cumulativeTime + task.duration);

      cumulativeTime += task.duration + 500;
    });
  }, []);

  const allComplete = completedTasks.length === creationTasks.length;

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
          animate={!allComplete ? {
            boxShadow: [
              '0 0 0 0 rgba(59, 130, 246, 0.4)',
              '0 0 20px 10px rgba(59, 130, 246, 0)',
            ],
          } : {}}
          transition={{ duration: 1.5, repeat: allComplete ? 0 : Infinity }}
        >
          {allComplete ? (
            <CheckCircle size={32} className="text-ordino-success" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 size={32} className="text-ordino-secondary" />
            </motion.div>
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {allComplete ? 'All Artifacts Created' : 'Creating Test Artifacts'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {allComplete
            ? 'Test plan, test design, and test cases have been created'
            : 'Creating approved test plan, test design, and test cases'}
        </p>
      </div>

      {/* Creation Tasks */}
      <div className="max-w-md mx-auto space-y-4">
        {creationTasks.map((task, index) => {
          const Icon = task.icon;
          const isComplete = completedTasks.includes(task.id);
          const progress = currentTaskProgress[task.id] || 0;
          const isActive = !isComplete && (index === 0 || completedTasks.includes(creationTasks[index - 1].id));

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`bg-ordino-bg rounded-xl border p-4 ${
                isComplete
                  ? 'border-ordino-success/30'
                  : isActive
                  ? 'border-ordino-primary/30'
                  : 'border-ordino-border'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Task icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isComplete
                    ? 'bg-ordino-success/20'
                    : isActive
                    ? 'bg-ordino-primary/20'
                    : 'bg-ordino-card'
                }`}>
                  <Icon size={24} className={
                    isComplete
                      ? 'text-ordino-success'
                      : isActive
                      ? 'text-ordino-primary'
                      : 'text-ordino-text-muted'
                  } />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${
                      isComplete
                        ? 'text-ordino-success'
                        : isActive
                        ? 'text-ordino-text'
                        : 'text-ordino-text-muted'
                    }`}>{task.name}</span>
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircle size={20} className="text-ordino-success" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 size={20} className="text-ordino-primary" />
                      </motion.div>
                    ) : null}
                  </div>
                  <p className="text-sm text-ordino-text-muted mb-2">
                    {task.description}
                  </p>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-ordino-border rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        isComplete ? 'bg-ordino-success' : 'bg-ordino-primary'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-md mx-auto"
        >
          <CheckCircle size={32} className="text-ordino-success mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-ordino-success mb-2">Creation Complete!</h4>
          <div className="space-y-2 text-sm text-ordino-text-muted">
            <div className="flex items-center justify-center gap-2">
              <ClipboardList size={16} className="text-ordino-success" />
              <span>Test Plan v{testPlan.version} updated</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <GitBranch size={16} className="text-ordino-success" />
              <span>Test Design v{testDesign.version} created</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FileText size={16} className="text-ordino-success" />
              <span>{draftedTestCases.length} test cases created</span>
            </div>
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
