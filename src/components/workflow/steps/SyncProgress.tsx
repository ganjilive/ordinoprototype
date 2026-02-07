import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, GitBranch, Database } from 'lucide-react';

const syncTasks = [
  { id: 1, target: 'TestRail', icon: Database, action: 'Creating test cases', count: 8 },
  { id: 2, target: 'GitHub', icon: GitBranch, action: 'Creating pull request', count: 1 },
];

export function SyncProgress() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    syncTasks.forEach((task, index) => {
      setTimeout(() => {
        setCompletedTasks((prev) => [...prev, task.id]);
      }, (index + 1) * 1500);
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
        <h3 className="text-lg font-semibold text-ordino-text">Applying Updates</h3>
        <p className="text-sm text-ordino-text-muted">Syncing approved changes to connected tools</p>
      </div>

      {/* Sync tasks */}
      <div className="max-w-md mx-auto space-y-4">
        {syncTasks.map((task) => {
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
                {/* Tool icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isComplete ? 'bg-ordino-success/20' : 'bg-ordino-card'
                }`}>
                  <Icon size={24} className={isComplete ? 'text-ordino-success' : 'text-ordino-text-muted'} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-ordino-text">{task.target}</span>
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
                  <p className="text-sm text-ordino-text-muted">
                    {task.action} ({task.count} items)
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-ordino-border rounded-full overflow-hidden">
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
      {completedTasks.length === syncTasks.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20"
        >
          <CheckCircle size={24} className="text-ordino-success mx-auto mb-2" />
          <p className="text-sm text-ordino-success font-medium">All updates applied successfully</p>
        </motion.div>
      )}
    </motion.div>
  );
}
