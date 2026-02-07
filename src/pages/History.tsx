import { motion } from 'framer-motion';
import { HistoryTable, TraceabilityView } from '../components/history';
import { historyEntries, traceabilityTree } from '../data/mockData';
import { staggerContainerVariants, slideUpVariants } from '../utils/animations';

export function History() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* History Table */}
      <motion.div variants={slideUpVariants}>
        <HistoryTable entries={historyEntries} />
      </motion.div>

      {/* Traceability Tree */}
      <motion.div variants={slideUpVariants}>
        <TraceabilityView nodes={traceabilityTree} />
      </motion.div>
    </motion.div>
  );
}
