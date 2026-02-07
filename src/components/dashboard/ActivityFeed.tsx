import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../common';
import { formatRelativeTime } from '../../utils/helpers';
import type { Activity } from '../../types';

interface ActivityFeedProps {
  activities: Activity[];
}

const toolColors: Record<string, string> = {
  jira: 'bg-blue-500',
  github: 'bg-gray-700',
  figma: 'bg-purple-500',
  testrail: 'bg-green-500',
  slack: 'bg-pink-500',
};

const toolLabels: Record<string, string> = {
  jira: 'Jira',
  github: 'GitHub',
  figma: 'Figma',
  testrail: 'TestRail',
  slack: 'Slack',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Badge variant="info">{activities.length} events</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 py-3 border-b border-ordino-border last:border-0"
            >
              {/* Tool indicator */}
              <div className={`w-2 h-2 mt-2 rounded-full ${toolColors[activity.tool]}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ordino-text">
                  {activity.action}{' '}
                  <span className="font-medium text-ordino-primary">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-ordino-text-muted">
                    via {toolLabels[activity.tool]}
                  </span>
                  <span className="text-xs text-ordino-text-muted">•</span>
                  <span className="text-xs text-ordino-text-muted">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </div>

              {/* Status */}
              <Badge
                variant={
                  activity.status === 'success'
                    ? 'success'
                    : activity.status === 'pending'
                    ? 'warning'
                    : 'error'
                }
                size="sm"
              >
                {activity.status}
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
