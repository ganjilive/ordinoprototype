import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, GitBranch, AlertCircle } from 'lucide-react';
import { Button, Badge } from '../../common';
import { testDesign, draftedTestCases } from '../../../data/mockData';

interface TestDesignReviewProps {
  onApprove?: () => void;
  onReject?: () => void;
}

export function TestDesignReview({ onApprove, onReject }: TestDesignReviewProps) {
  const [, setCurrentPhase] = useState<'peer' | 'lead'>('peer');
  const [peerReviewComplete, setPeerReviewComplete] = useState(false);
  const [leadReviewComplete, setLeadReviewComplete] = useState(false);

  const affectedPaths = testDesign.paths.filter(p => p.status === 'affected');

  const peerReviewChecklist = [
    { id: 1, item: 'Test coverage completeness', status: 'checked' },
    { id: 2, item: 'Adherence to testing standards', status: 'checked' },
    { id: 3, item: 'Automation strategy viability', status: 'checked' },
    { id: 4, item: 'Test data requirements', status: 'checked' },
  ];

  useEffect(() => {
    // Peer review auto-completes after delay
    const peerTimer = setTimeout(() => {
      setPeerReviewComplete(true);
      setCurrentPhase('lead');
    }, 3000);

    return () => clearTimeout(peerTimer);
  }, []);

  useEffect(() => {
    // Lead review auto-completes after peer is done
    if (peerReviewComplete) {
      const leadTimer = setTimeout(() => {
        setLeadReviewComplete(true);
      }, 2500);

      return () => clearTimeout(leadTimer);
    }
  }, [peerReviewComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Test Design Review</h3>
          <p className="text-sm text-ordino-text-muted">
            Combined peer and lead review of drafted test design
          </p>
        </div>
        <Badge variant={leadReviewComplete ? 'success' : peerReviewComplete ? 'warning' : 'info'}>
          {leadReviewComplete ? 'All Reviews Complete' : peerReviewComplete ? 'Lead Review' : 'Peer Review'}
        </Badge>
      </div>

      {/* Review Progress */}
      <div className="flex items-center gap-4 p-4 bg-ordino-bg rounded-xl border border-ordino-border">
        <div className="flex items-center gap-2">
          {peerReviewComplete ? (
            <CheckCircle size={20} className="text-ordino-success" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-ordino-primary border-t-transparent rounded-full"
            />
          )}
          <span className={`text-sm ${peerReviewComplete ? 'text-ordino-success' : 'text-ordino-text'}`}>
            Peer Review
          </span>
        </div>
        <div className="flex-1 h-0.5 bg-ordino-border">
          <motion.div
            className="h-full bg-ordino-primary"
            initial={{ width: '0%' }}
            animate={{ width: peerReviewComplete ? '100%' : '50%' }}
          />
        </div>
        <div className="flex items-center gap-2">
          {leadReviewComplete ? (
            <CheckCircle size={20} className="text-ordino-success" />
          ) : peerReviewComplete ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-ordino-primary border-t-transparent rounded-full"
            />
          ) : (
            <Clock size={20} className="text-ordino-text-muted" />
          )}
          <span className={`text-sm ${leadReviewComplete ? 'text-ordino-success' : peerReviewComplete ? 'text-ordino-text' : 'text-ordino-text-muted'}`}>
            Lead Review
          </span>
        </div>
      </div>

      {/* Peer Review Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden"
      >
        <div className="bg-ordino-card px-4 py-3 border-b border-ordino-border">
          <div className="flex items-center gap-2">
            <User size={18} className="text-ordino-primary" />
            <span className="font-medium text-ordino-text">Peer Review</span>
            {peerReviewComplete && <Badge variant="success" size="sm">Approved</Badge>}
          </div>
        </div>

        <div className="p-4">
          {/* Reviewer Info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-ordino-primary/20 flex items-center justify-center">
              <User size={24} className="text-ordino-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-ordino-text">Alex Kim</p>
              <p className="text-sm text-ordino-text-muted">Senior QA Engineer</p>
            </div>
          </div>

          {/* Review Checklist */}
          <div className="space-y-2 mb-4">
            {peerReviewChecklist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-center gap-3 p-2 bg-ordino-card rounded-lg"
              >
                <CheckCircle size={16} className="text-ordino-success" />
                <span className="text-sm text-ordino-text">{item.item}</span>
              </motion.div>
            ))}
          </div>

          {/* Peer Comments */}
          {peerReviewComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-ordino-card rounded-lg border border-ordino-border"
            >
              <p className="text-xs text-ordino-text-muted italic">
                "Test design is comprehensive and follows best practices. Automation strategy is well-thought-out
                with realistic feasibility assessments. Ready for lead review."
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Lead Review Section */}
      {peerReviewComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border overflow-hidden"
        >
          <div className="bg-ordino-card px-4 py-3 border-b border-ordino-border">
            <div className="flex items-center gap-2">
              <User size={18} className="text-ordino-secondary" />
              <span className="font-medium text-ordino-text">Lead Review</span>
              {leadReviewComplete && <Badge variant="success" size="sm">Approved</Badge>}
            </div>
          </div>

          <div className="p-4">
            {/* Reviewer Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-ordino-secondary/20 flex items-center justify-center">
                <User size={24} className="text-ordino-secondary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ordino-text">Morgan Chen</p>
                <p className="text-sm text-ordino-text-muted">QA Lead / Test Manager</p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
                <p className="text-xl font-bold text-ordino-primary">{affectedPaths.length}</p>
                <p className="text-xs text-ordino-text-muted">Affected Paths</p>
              </div>
              <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
                <p className="text-xl font-bold text-ordino-success">{draftedTestCases.length}</p>
                <p className="text-xs text-ordino-text-muted">New Test Cases</p>
              </div>
              <div className="text-center p-3 bg-ordino-card rounded-lg border border-ordino-border">
                <p className="text-xl font-bold text-ordino-secondary">v{testDesign.version}</p>
                <p className="text-xs text-ordino-text-muted">New Version</p>
              </div>
            </div>

            {/* Test Design Changes */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={16} className="text-ordino-primary" />
                <h4 className="font-semibold text-ordino-text text-sm">Test Design Changes</h4>
              </div>
              <div className="space-y-2">
                {affectedPaths.map((path) => (
                  <div
                    key={path.id}
                    className="p-2 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-ordino-text">{path.name}</span>
                      <Badge variant="warning" size="sm">Updated</Badge>
                    </div>
                    <p className="text-xs text-ordino-text-muted">{path.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Comments */}
            {leadReviewComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-ordino-card rounded-lg border border-ordino-success/30"
              >
                <p className="text-xs text-ordino-text-muted italic">
                  "Test design and test cases are approved. Automation feasibility assessments are realistic.
                  Coverage is comprehensive. Ready to create artifacts in the test repository."
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 bg-ordino-warning/10 rounded-lg border border-ordino-warning/20">
        <AlertCircle size={16} className="text-ordino-warning flex-shrink-0 mt-0.5" />
        <p className="text-xs text-ordino-text-muted">
          Approving will create a new version of the test design and add the new test cases to the test repository.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="danger" onClick={onReject} className="flex-1">
          <XCircle size={18} />
          Reject
        </Button>
        <Button
          variant="primary"
          onClick={onApprove}
          className="flex-1"
          disabled={!leadReviewComplete}
        >
          <CheckCircle size={18} />
          {leadReviewComplete ? 'Approve' : 'Awaiting Reviews...'}
        </Button>
      </div>
    </motion.div>
  );
}
