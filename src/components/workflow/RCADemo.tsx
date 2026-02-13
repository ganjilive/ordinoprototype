import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function RCADemoComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center"
    >
      <div className="w-20 h-20 rounded-full bg-ordino-primary/20 flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-ordino-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-ordino-text mb-3">
        RCA Demo
      </h2>
      <p className="text-ordino-text-muted max-w-md">
        This demo workflow is coming soon. It will showcase the AI-powered root cause
        analysis process including failure analysis, defect triage, and traceability.
      </p>
    </motion.div>
  );
}
