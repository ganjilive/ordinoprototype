import { motion } from 'framer-motion';
import { CheckCircle, User, Database, Shield } from 'lucide-react';
import { Button, Badge } from '../../common';
import { useState, useEffect } from 'react';
import { testDataStrategy } from '../../../data/mockData';

interface TestDataApprovalProps {
  onApprove: () => void;
  onReject: () => void;
}

export function TestDataApproval({ onApprove, onReject }: TestDataApprovalProps) {
  const [isReviewing, setIsReviewing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReviewing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReviewing) {
      const timer = setTimeout(() => {
        onApprove();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isReviewing, onApprove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Test Data Strategy Approval</h3>
          <p className="text-sm text-ordino-text-muted">
            Validating data requirements and compliance
          </p>
        </div>
        <Badge variant={isReviewing ? 'warning' : 'success'}>
          {isReviewing ? 'In Review' : 'Approved'}
        </Badge>
      </div>

      {/* Reviewer Info */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-ordino-primary/20 flex items-center justify-center">
            <User size={28} className="text-ordino-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ordino-text">Jordan Lee</p>
            <p className="text-sm text-ordino-text-muted">Data Engineer • Test Data Specialist</p>
            <p className="text-xs text-ordino-text-muted mt-1">
              Expert in test data management and compliance
            </p>
          </div>
          {!isReviewing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-full bg-ordino-success/20 flex items-center justify-center"
            >
              <CheckCircle size={20} className="text-ordino-success" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Strategy Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Database size={20} className="text-ordino-primary" />
          <h4 className="font-semibold text-ordino-text">Strategy Summary</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-ordino-card p-3 rounded-lg">
            <p className="text-xs text-ordino-text-muted mb-1">Data Entities</p>
            <p className="text-2xl font-bold text-ordino-primary">
              {testDataStrategy.requirements.length}
            </p>
          </div>
          <div className="bg-ordino-card p-3 rounded-lg">
            <p className="text-xs text-ordino-text-muted mb-1">Setup Scripts</p>
            <p className="text-2xl font-bold text-ordino-primary">
              {testDataStrategy.setupScripts.length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Compliance Check */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield size={20} className="text-ordino-success" />
          <h4 className="font-semibold text-ordino-text">Privacy Compliance Checklist</h4>
        </div>

        <div className="space-y-2">
          {testDataStrategy.privacyCompliance.map((compliance, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-ordino-card rounded-lg"
            >
              <CheckCircle size={18} className="text-ordino-success" />
              <span className="text-sm text-ordino-text">{compliance} Compliant</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 p-3 bg-ordino-card rounded-lg"
          >
            <CheckCircle size={18} className="text-ordino-success" />
            <span className="text-sm text-ordino-text">No production data used</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Infrastructure Requirements */}
      {!isReviewing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <h4 className="font-semibold text-ordino-text mb-3">Infrastructure Check</h4>
          <div className="space-y-2">
            {testDataStrategy.dependencies.map((dep, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-ordino-card rounded-lg"
              >
                <span className="text-sm text-ordino-text">{dep}</span>
                <Badge variant="success" size="sm">Available</Badge>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Approval Comments */}
      {!isReviewing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-ordino-success/10 to-transparent rounded-xl border border-ordino-success/20 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-ordino-success/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-ordino-success" />
            </div>
            <div>
              <h4 className="font-semibold text-ordino-text mb-1">Approval Granted</h4>
              <p className="text-sm text-ordino-text-muted mb-2">
                "Test data strategy is comprehensive and compliant. All infrastructure requirements are met.
                Data generation approach is scalable and maintains privacy standards."
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ordino-text-muted">Jordan Lee</span>
                <span className="text-xs text-ordino-text-muted">•</span>
                <Badge variant="success" size="sm">Approved</Badge>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Manual Override */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-end gap-3 pt-4 border-t border-ordino-border"
      >
        <p className="text-xs text-ordino-text-muted mr-auto">
          Manual override for demo purposes
        </p>
        <Button variant="ghost" onClick={onReject} size="sm">
          Reject
        </Button>
        <Button onClick={onApprove} size="sm">
          <CheckCircle size={16} />
          Skip to Approve
        </Button>
      </motion.div>
    </motion.div>
  );
}
