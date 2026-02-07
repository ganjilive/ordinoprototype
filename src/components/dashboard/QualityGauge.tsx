import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../common';

interface QualityGaugeProps {
  score: number;
}

export function QualityGauge({ score }: QualityGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * 56;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-ordino-success';
    if (value >= 60) return 'text-ordino-warning';
    return 'text-ordino-error';
  };

  const getStrokeColor = (value: number) => {
    if (value >= 80) return '#22c55e';
    if (value >= 60) return '#eab308';
    return '#ef4444';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#1e293b"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke={getStrokeColor(animatedScore)}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${progress} ${circumference}` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={`text-4xl font-bold ${getScoreColor(animatedScore)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Math.round(animatedScore)}
              </motion.span>
              <span className="text-sm text-ordino-text-muted">/ 100</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-ordino-text">Overall Quality</p>
            <p className="text-xs text-ordino-text-muted mt-1">
              Based on coverage, pass rate & automation
            </p>
          </div>

          {/* Score breakdown */}
          <div className="mt-4 w-full grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-ordino-bg rounded-lg">
              <p className="text-xs text-ordino-text-muted">Coverage</p>
              <p className="text-sm font-semibold text-ordino-primary">87%</p>
            </div>
            <div className="p-2 bg-ordino-bg rounded-lg">
              <p className="text-xs text-ordino-text-muted">Pass Rate</p>
              <p className="text-sm font-semibold text-ordino-success">99%</p>
            </div>
            <div className="p-2 bg-ordino-bg rounded-lg">
              <p className="text-xs text-ordino-text-muted">Automation</p>
              <p className="text-sm font-semibold text-ordino-secondary">76%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
