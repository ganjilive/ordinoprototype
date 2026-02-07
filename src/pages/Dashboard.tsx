import { motion } from 'framer-motion';
import { MetricCard, TrendChart, QualityGauge, ActivityFeed, ConnectedTools } from '../components/dashboard';
import { metrics, trendData, activities, connectedTools } from '../data/mockData';
import { staggerContainerVariants, slideUpVariants } from '../utils/animations';

export function Dashboard() {
  // Calculate quality score from metrics
  const qualityScore = Math.round(
    (metrics[0].value * 0.4 + metrics[1].value * 0.4 + metrics[2].value * 0.2)
  );

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Metrics Grid */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrendChart data={trendData} />
        <QualityGauge score={qualityScore} />
      </motion.div>

      {/* Activity & Tools Row */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={activities} />
        <ConnectedTools tools={connectedTools} />
      </motion.div>
    </motion.div>
  );
}
