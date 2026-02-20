import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/helpers';
import type { TestExecutionStepStatus } from '../../hooks/useTestExecutionWorkflow';

interface TestExecutionTimelineProps {
  steps: { id: number; status: TestExecutionStepStatus }[];
  currentStep: number;
}

const stepTitles = [
  'Run Locally',
  'CI/CD Pipeline',
  'Generate Results',
];

export function TestExecutionTimeline({ steps, currentStep }: TestExecutionTimelineProps) {
  return (
    <div className="w-64 flex-shrink-0">
      <h3 className="text-sm font-semibold text-ordino-text-muted mb-4 uppercase tracking-wider">
        Execution Progress
      </h3>
      <div className="relative">
        {/* Vertical background line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-ordino-border" />

        {/* Animated progress line */}
        <motion.div
          className="absolute left-4 top-4 w-0.5 bg-ordino-primary"
          initial={{ height: 0 }}
          animate={{
            height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center gap-4"
            >
              {/* Step indicator */}
              <motion.div
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                  step.status === 'completed' && 'bg-ordino-primary',
                  step.status === 'active' && 'bg-ordino-card border-2 border-ordino-primary',
                  step.status === 'pending' && 'bg-ordino-card border-2 border-ordino-border'
                )}
                animate={
                  step.status === 'active'
                    ? {
                        boxShadow: [
                          '0 0 0 0 rgba(249, 115, 22, 0.4)',
                          '0 0 10px 0 rgba(249, 115, 22, 0)',
                        ],
                      }
                    : {}
                }
                transition={
                  step.status === 'active'
                    ? { duration: 1.5, repeat: Infinity }
                    : {}
                }
              >
                {step.status === 'completed' ? (
                  <Check size={16} className="text-white" />
                ) : (
                  <span
                    className={cn(
                      'text-sm font-medium',
                      step.status === 'active' ? 'text-ordino-primary' : 'text-ordino-text-muted'
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </motion.div>

              {/* Step title */}
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm font-medium transition-colors',
                    step.status === 'active' && 'text-ordino-primary',
                    step.status === 'completed' && 'text-ordino-text',
                    step.status === 'pending' && 'text-ordino-text-muted'
                  )}
                >
                  {stepTitles[index]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
