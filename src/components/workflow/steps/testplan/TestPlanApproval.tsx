import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, User, Calendar, Tag, ExternalLink, Bell, MessageSquare, Mail } from 'lucide-react';
import { Button, Badge } from '../../../common';

interface TestPlanApprovalProps {
  onApprove: () => void;
}

export function TestPlanApproval({ onApprove }: TestPlanApprovalProps) {
  const [showPlan, setShowPlan] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [approved, setApproved] = useState(false);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Show plan after 1s
    const planTimer = setTimeout(() => setShowPlan(true), 1000);
    // Show approval after 2.5s
    const approvalTimer = setTimeout(() => setShowApproval(true), 2500);

    return () => {
      clearTimeout(planTimer);
      clearTimeout(approvalTimer);
    };
  }, []);

  const handleApprove = () => {
    setApproved(true);
    setCreating(true);

    // Create test plan
    setTimeout(() => {
      setCreating(false);
      setCreated(true);
      setNotifying(true);

      // Send notifications
      const notificationList = ['#qa-team', 'product-team@company.com', '@sarah.chen'];
      notificationList.forEach((recipient, index) => {
        setTimeout(() => {
          setNotifications(prev => [...prev, recipient]);
        }, index * 500);
      });

      // Complete workflow
      setTimeout(() => {
        setNotifying(false);
        onApprove();
      }, notificationList.length * 500 + 1000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Refined Test Plan */}
      {showPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-ordino-primary px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-white" />
              <span className="text-white font-medium text-sm">Test Plan: ORD-1234 Two-Factor Authentication</span>
            </div>
            <ExternalLink size={16} className="text-white/70" />
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Meta info */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-ordino-text-muted" />
                <span className="text-ordino-text-muted">Created by:</span>
                <span className="text-ordino-text font-medium">Ordino AI</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-ordino-text-muted" />
                <span className="text-ordino-text-muted">Date:</span>
                <span className="text-ordino-text">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag size={14} className="text-ordino-text-muted" />
                <Badge variant="success" size="sm">v1.0</Badge>
              </div>
            </div>

            {/* Test Plan Sections */}
            <div className="space-y-3">
              <div className="bg-ordino-card rounded-lg p-3 border border-ordino-border">
                <h4 className="text-sm font-semibold text-ordino-primary mb-2">1. Test Scope</h4>
                <ul className="text-sm text-ordino-text-muted space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Web application 2FA for login and sensitive operations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Mobile app testing for SMS and email OTP (per Sarah Chen)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-ordino-card rounded-lg p-3 border border-ordino-border">
                <h4 className="text-sm font-semibold text-ordino-primary mb-2">2. Test Strategy</h4>
                <ul className="text-sm text-ordino-text-muted space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Functional testing for all 2FA methods (SMS, Email, Authenticator)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Security penetration testing (per Michael Torres)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Integration testing with existing auth system (per David Kim)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-ordino-card rounded-lg p-3 border border-ordino-border">
                <h4 className="text-sm font-semibold text-ordino-primary mb-2">3. Test Environment</h4>
                <ul className="text-sm text-ordino-text-muted space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Staging environment with SMS gateway integration (per Sarah Chen)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Containerized test environment (per David Kim)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-ordino-card rounded-lg p-3 border border-ordino-border">
                <h4 className="text-sm font-semibold text-ordino-primary mb-2">4. Entry/Exit Criteria</h4>
                <ul className="text-sm text-ordino-text-muted space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Entry: All 2FA code changes deployed to staging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Exit: 80% code coverage threshold met (per Michael Torres)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-ordino-success mt-0.5 flex-shrink-0" />
                    <span>Exit: Zero critical/high severity defects</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Approval Section */}
      {showApproval && !approved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-ordino-primary/10 to-ordino-success/5 rounded-xl border border-ordino-primary/30 p-6"
        >
          <div className="text-center mb-4">
            <CheckCircle size={48} className="text-ordino-success mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-ordino-text mb-2">
              Test Plan Ready for Architect Approval
            </h3>
            <p className="text-sm text-ordino-text-muted">
              All stakeholder feedback has been incorporated. Approve to create the test plan.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="ghost" size="lg">
              Request Changes
            </Button>
            <Button onClick={handleApprove} size="lg">
              <CheckCircle size={18} />
              Approve Test Plan
            </Button>
          </div>
        </motion.div>
      )}

      {/* Creation Progress */}
      {creating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-ordino-card rounded-lg border border-ordino-border p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ordino-primary/20 flex items-center justify-center">
              <FileText size={20} className="text-ordino-primary animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ordino-text">Creating Test Plan...</h4>
              <p className="text-xs text-ordino-text-muted">Generating document and updating test repository</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications */}
      {created && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-ordino-success" />
            <h4 className="text-sm font-semibold text-ordino-text">Test Plan Created Successfully</h4>
          </div>

          <div className="bg-ordino-card rounded-lg border border-ordino-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={16} className="text-ordino-primary" />
              <h5 className="text-sm font-semibold text-ordino-text">
                {notifying ? 'Notifying Stakeholders...' : 'Notifications Sent'}
              </h5>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {notifications.map((recipient) => (
                  <motion.div
                    key={recipient}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    {recipient.startsWith('#') ? (
                      <MessageSquare size={14} className="text-pink-500" />
                    ) : recipient.includes('@') && recipient.includes('.') ? (
                      <Mail size={14} className="text-blue-500" />
                    ) : (
                      <MessageSquare size={14} className="text-pink-500" />
                    )}
                    <span className="text-ordino-text-muted">{recipient}</span>
                    <CheckCircle size={14} className="text-ordino-success ml-auto" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
