import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, CheckCircle, Zap, Bug } from 'lucide-react';
import { Card } from '../common';
import type { Metric } from '../../types';

interface MetricCardProps {
  metric: Metric;
  index: number;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Target,
  CheckCircle,
  Zap,
  Bug,
};

const colorMap: Record<string, string> = {
  Target: 'text-ordino-primary bg-ordino-primary/20',
  CheckCircle: 'text-ordino-success bg-ordino-success/20',
  Zap: 'text-ordino-secondary bg-ordino-secondary/20',
  Bug: 'text-ordino-error bg-ordino-error/20',
};

export function MetricCard({ metric, index }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const Icon = iconMap[metric.icon] || Target;
  const colorClass = colorMap[metric.icon] || colorMap.Target;

  // Animated counter effect
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = metric.value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= metric.value) {
        setDisplayValue(metric.value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [metric.value]);

  const formattedValue = metric.unit === '%'
    ? `${displayValue.toFixed(1)}%`
    : Math.round(displayValue).toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="relative overflow-hidden">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-ordino-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm text-ordino-text-muted mb-1">{metric.label}</p>
            <motion.p
              className="text-3xl font-bold text-ordino-text"
              key={formattedValue}
            >
              {formattedValue}
            </motion.p>
            <div className="flex items-center gap-1 mt-2">
              {metric.trend === 'up' ? (
                <TrendingUp size={16} className="text-ordino-success" />
              ) : (
                <TrendingDown size={16} className="text-ordino-success" />
              )}
              <span className="text-sm text-ordino-success">
                {metric.trend === 'up' ? '+' : '-'}{metric.trendValue}{metric.unit}
              </span>
              <span className="text-xs text-ordino-text-muted">vs last week</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
