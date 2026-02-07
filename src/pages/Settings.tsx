import { motion } from 'framer-motion';
import { IntegrationCard, ProjectConfig } from '../components/settings';
import { connectedTools } from '../data/mockData';
import { staggerContainerVariants, slideUpVariants } from '../utils/animations';

export function Settings() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Integrations */}
      <motion.div variants={slideUpVariants}>
        <h2 className="text-lg font-semibold text-ordino-text mb-4">Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedTools.map((tool) => (
            <IntegrationCard key={tool.id} tool={tool} />
          ))}
        </div>
      </motion.div>

      {/* Project Configuration */}
      <motion.div variants={slideUpVariants}>
        <h2 className="text-lg font-semibold text-ordino-text mb-4">Project Settings</h2>
        <ProjectConfig />
      </motion.div>
    </motion.div>
  );
}
