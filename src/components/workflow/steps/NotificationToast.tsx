import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, MessageSquare, Mail, Users, FileText, Code, GitBranch } from 'lucide-react';
import { testDesign, draftedTestCases, automationScripts } from '../../../data/mockData';

const readyScripts = automationScripts.filter(s => s.status === 'drafted');

const notifications = [
  {
    id: 1,
    channel: 'Slack',
    icon: MessageSquare,
    recipient: '#qa-team',
    message: `Test design v${testDesign.version} created with ${draftedTestCases.length} new test cases`,
    color: 'bg-pink-500',
  },
  {
    id: 2,
    channel: 'Email',
    icon: Mail,
    recipient: 'product-team@company.com',
    message: `${readyScripts.length} automation scripts created in test-automation-repo`,
    color: 'bg-blue-500',
  },
  {
    id: 3,
    channel: 'Slack',
    icon: MessageSquare,
    recipient: '@john.smith',
    message: 'Automation scripts ready for ORD-1234: 2FA authentication feature',
    color: 'bg-pink-500',
  },
];

export function NotificationToast() {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [allSent, setAllSent] = useState(false);

  useEffect(() => {
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        setVisibleNotifications((prev) => [...prev, notification.id]);
      }, index * 800);
    });

    setTimeout(() => {
      setAllSent(true);
    }, notifications.length * 800 + 500);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
          animate={!allSent ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.5, repeat: allSent ? 0 : Infinity }}
        >
          {allSent ? (
            <CheckCircle size={32} className="text-ordino-success" />
          ) : (
            <Bell size={32} className="text-ordino-primary" />
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {allSent ? 'Notifications Sent' : 'Notifying Stakeholders'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {allSent ? 'All stakeholders have been notified' : 'Sending updates to relevant channels'}
        </p>
      </div>

      {/* Notification stack */}
      <div className="max-w-md mx-auto space-y-3">
        <AnimatePresence>
          {notifications.map((notification) => {
            const Icon = notification.icon;
            const isVisible = visibleNotifications.includes(notification.id);

            if (!isVisible) return null;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-ordino-bg rounded-xl border border-ordino-border p-4 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${notification.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-ordino-text">{notification.channel}</span>
                      <span className="text-xs text-ordino-text-muted">{notification.recipient}</span>
                    </div>
                    <p className="text-sm text-ordino-text-muted">{notification.message}</p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CheckCircle size={16} className="text-ordino-success" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Summary */}
      {allSent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto space-y-4"
        >
          {/* Workflow Summary */}
          <div className="p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20">
            <h4 className="text-sm font-semibold text-ordino-text mb-3">Workflow Summary</h4>
            <div className="space-y-2 text-xs text-ordino-text-muted">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-ordino-success" />
                <span>Test Design v{testDesign.version} created</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-ordino-success" />
                <span>{draftedTestCases.length} test cases created</span>
              </div>
              <div className="flex items-center gap-2">
                <Code size={14} className="text-ordino-success" />
                <span>{readyScripts.length} automation scripts created</span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch size={14} className="text-ordino-success" />
                <span>Scripts available in test-automation-repo</span>
              </div>
            </div>
          </div>

          {/* Recipients Summary */}
          <div className="p-4 bg-ordino-card rounded-xl border border-ordino-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ordino-text-muted" />
                <span className="text-sm text-ordino-text-muted">Recipients notified</span>
              </div>
              <span className="text-sm font-medium text-ordino-text">{notifications.length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
