import { motion } from 'framer-motion';
import { Brain, Sparkles, Search, FileText, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const analysisSteps = [
  { icon: Search, text: 'Scanning requirement details...' },
  { icon: FileText, text: 'Extracting acceptance criteria...' },
  { icon: Brain, text: 'Analyzing testability factors...' },
  { icon: CheckCircle, text: 'Generating coverage analysis...' },
];

export function OrdinoThinking() {
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentAnalysisStep((prev) => (prev + 1) % analysisSteps.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8"
    >
      {/* AI Brain Animation */}
      <div className="relative mb-8">
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-ordino-primary/20 to-ordino-secondary/20 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0 0 rgba(249, 115, 22, 0.4)',
              '0 0 40px 20px rgba(249, 115, 22, 0.1)',
              '0 0 0 0 rgba(249, 115, 22, 0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Brain size={48} className="text-ordino-primary" />
          </motion.div>
        </motion.div>

        {/* Orbiting particles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 1,
            }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-ordino-secondary"
              style={{
                transform: 'translateX(60px)',
              }}
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Status text */}
      <motion.div
        key={currentAnalysisStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <Sparkles size={16} className="text-ordino-primary" />
        <span className="text-ordino-text">
          {analysisSteps[currentAnalysisStep].text}
        </span>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-ordino-text-muted mb-2">
          <span>Analyzing Requirement</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
        <div className="h-2 bg-ordino-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ordino-primary to-ordino-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Analysis details */}
      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
        {analysisSteps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = (progress / 100) * 4 > index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isComplete ? 1 : 0.5 }}
              className="flex items-center gap-2 text-sm"
            >
              <Icon
                size={16}
                className={isComplete ? 'text-ordino-success' : 'text-ordino-text-muted'}
              />
              <span className={isComplete ? 'text-ordino-text' : 'text-ordino-text-muted'}>
                {step.text.replace('...', '')}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
