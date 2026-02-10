import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Code, GitBranch, ExternalLink } from 'lucide-react';
import { Badge } from '../../common';
import { automationScripts } from '../../../data/mockData';

const repositoryConfig = {
  name: 'test-automation-repo',
  url: 'https://github.com/company/test-automation-repo',
  branch: 'main',
};

const readyScripts = automationScripts.filter(s => s.status === 'drafted');

const creationTasks = readyScripts.map((script, index) => ({
  id: script.id,
  name: script.id,
  description: script.testCaseTitle,
  scriptType: script.scriptType,
  framework: script.framework,
  duration: 2000 + index * 500,
}));

export function AutomationScriptCreation() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    creationTasks.forEach((task) => {
      setTimeout(() => {
        setCompletedTasks((prev) => [...prev, task.id]);
      }, task.duration);
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
            <Code size={32} className="text-ordino-secondary" />
          </motion.div>
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">Creating Automation Scripts</h3>
        <p className="text-sm text-ordino-text-muted">
          Creating approved scripts in {repositoryConfig.name}
        </p>
      </div>

      {/* Repository Info */}
      <div className="bg-ordino-bg rounded-xl border border-ordino-border p-4">
        <div className="flex items-center gap-3">
          <GitBranch size={20} className="text-ordino-primary" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-ordino-text">Repository:</span>
              <span className="text-sm text-ordino-text-muted">{repositoryConfig.name}</span>
              <Badge variant="info" size="sm">{repositoryConfig.branch}</Badge>
            </div>
            <a
              href={repositoryConfig.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ordino-primary hover:underline flex items-center gap-1"
            >
              {repositoryConfig.url}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Script Creation Tasks */}
      <div className="max-w-md mx-auto space-y-4">
        {creationTasks.map((task) => {
          const script = automationScripts.find(s => s.id === task.id);
          const isComplete = completedTasks.includes(task.id);

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
            >
              <div className="flex items-center gap-4">
                {/* Script icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isComplete ? 'bg-ordino-success/20' : 'bg-ordino-card'
                }`}>
                  {isComplete ? (
                    <CheckCircle size={24} className="text-ordino-success" />
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 size={24} className="text-ordino-secondary" />
                    </motion.div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ordino-text">{task.name}</span>
                      <Badge variant="success" size="sm">{task.scriptType}</Badge>
                      <Badge variant="info" size="sm">{task.framework}</Badge>
                    </div>
                    {isComplete && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <CheckCircle size={20} className="text-ordino-success" />
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
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-ordino-success/10 rounded-xl border border-ordino-success/20 max-w-md mx-auto"
        >
          <CheckCircle size={32} className="text-ordino-success mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-ordino-success mb-2">Scripts Created!</h4>
          <div className="text-sm text-ordino-text-muted space-y-1 mb-4">
            <div>{completedTasks.length} automation script{completedTasks.length !== 1 ? 's' : ''} successfully created</div>
            <div className="mt-3 pt-3 border-t border-ordino-success/20">
              <div className="text-xs text-ordino-text-muted mb-2">Created Scripts:</div>
              <div className="text-xs text-ordino-text-muted">
                {creationTasks.map(t => t.name).join(', ')}
              </div>
            </div>
          </div>
          <a
            href={repositoryConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ordino-primary hover:underline"
          >
            View in Repository
            <ExternalLink size={14} />
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
