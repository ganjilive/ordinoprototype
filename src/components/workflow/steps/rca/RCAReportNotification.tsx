import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MessageSquare, Mail, ExternalLink, Users, FileText } from 'lucide-react';
import { rcaStakeholderNotifications, rcaReport } from '../../../../data/rcaMockData';

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare size={20} className="text-white" />,
  Mail: <Mail size={20} className="text-white" />,
  ExternalLink: <ExternalLink size={20} className="text-white" />,
};

export function RCAReportNotification() {
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [allSent, setAllSent] = useState(false);

  useEffect(() => {
    rcaStakeholderNotifications.forEach((notif, index) => {
      setTimeout(() => {
        setVisibleNotifications(prev => [...prev, notif.id]);
      }, index * 800);
    });

    setTimeout(() => {
      setAllSent(true);
    }, rcaStakeholderNotifications.length * 800 + 500);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
          animate={!allSent ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: allSent ? 0 : Infinity }}
        >
          {allSent ? (
            <CheckCircle size={32} className="text-ordino-success" />
          ) : (
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>
              <FileText size={32} className="text-ordino-primary" />
            </motion.div>
          )}
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text">
          {allSent ? 'RCA Report Distributed' : 'Distributing RCA Report'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {allSent ? 'All stakeholders notified' : 'Sending report to relevant channels and tools'}
        </p>
      </div>

      {/* Notification cards */}
      <div className="max-w-md mx-auto space-y-3">
        <AnimatePresence>
          {rcaStakeholderNotifications.map((notif) => {
            if (!visibleNotifications.includes(notif.id)) return null;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-ordino-bg rounded-xl border border-ordino-border p-4 shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${notif.color} flex items-center justify-center flex-shrink-0`}>
                    {iconMap[notif.icon] ?? <FileText size={20} className="text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-ordino-text">{notif.channel}</span>
                      <span className="text-xs text-ordino-text-muted">{notif.recipient}</span>
                    </div>
                    <p className="text-sm text-ordino-text-muted">{notif.message}</p>
                  </div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
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
          {/* Workflow summary */}
          <div className="p-4 bg-ordino-success/10 rounded-xl border border-ordino-success/20">
            <h4 className="text-sm font-semibold text-ordino-text mb-3">RCA Workflow Summary</h4>
            <div className="space-y-2 text-xs text-ordino-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-ordino-success" />
                <span>Root cause confirmed: JWT_EXPIRY config drift (f8a2c91)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-ordino-success" />
                <span>TC-042 assertion updated to reflect 300s expiry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-ordino-success" />
                <span>{rcaReport.resolutionSteps.length} resolution steps assigned to owners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-ordino-success" />
                <span>{rcaReport.preventionRecommendations.length} prevention recommendations documented</span>
              </div>
            </div>
          </div>

          {/* Recipients summary */}
          <div className="p-4 bg-ordino-card rounded-xl border border-ordino-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ordino-text-muted" />
                <span className="text-sm text-ordino-text-muted">Stakeholders notified</span>
              </div>
              <span className="text-sm font-medium text-ordino-text">{rcaStakeholderNotifications.length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
