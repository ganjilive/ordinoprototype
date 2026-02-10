import { motion } from 'framer-motion';
import { Database, Shield, RefreshCw, FileCode, Trash2, Link } from 'lucide-react';
import { Badge } from '../../common';
import { testDataStrategy } from '../../../data/mockData';

export function TestDataStrategy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ordino-text mb-1">Test Data Strategy</h3>
          <p className="text-sm text-ordino-text-muted">
            Comprehensive data requirements and generation plan
          </p>
        </div>
        <Badge variant="primary">Data Management</Badge>
      </div>

      {/* Data Requirements */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Database size={20} className="text-ordino-primary" />
          <h4 className="font-semibold text-ordino-text">Data Requirements</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ordino-border">
                <th className="text-left text-xs font-medium text-ordino-text-muted pb-2 pr-4">Entity</th>
                <th className="text-left text-xs font-medium text-ordino-text-muted pb-2 pr-4">Volume</th>
                <th className="text-left text-xs font-medium text-ordino-text-muted pb-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {testDataStrategy.requirements.map((req, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border-b border-ordino-border/50"
                >
                  <td className="py-3 pr-4">
                    <span className="text-sm text-ordino-text font-medium">{req.entity}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm text-ordino-text-muted">{req.volume}</span>
                  </td>
                  <td className="py-3">
                    <Badge variant="secondary" size="sm">{req.type}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Generation Strategy */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <FileCode size={20} className="text-ordino-primary" />
          <h4 className="font-semibold text-ordino-text">Generation Strategy</h4>
        </div>
        <p className="text-sm text-ordino-text-muted">
          {testDataStrategy.generationStrategy}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {/* Privacy Compliance */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={20} className="text-ordino-success" />
            <h4 className="font-semibold text-ordino-text">Privacy Compliance</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {testDataStrategy.privacyCompliance.map((compliance, index) => (
              <Badge key={index} variant="success" size="sm">
                {compliance}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-ordino-text-muted mt-3">
            All test data complies with data privacy regulations
          </p>
        </motion.div>

        {/* Data Refresh */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={20} className="text-ordino-primary" />
            <h4 className="font-semibold text-ordino-text">Data Refresh</h4>
          </div>
          <p className="text-2xl font-bold text-ordino-primary mb-1">
            {testDataStrategy.dataRefreshFrequency}
          </p>
          <p className="text-xs text-ordino-text-muted">
            Ensures clean state for each test execution
          </p>
        </motion.div>
      </div>

      {/* Setup Scripts */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <FileCode size={20} className="text-ordino-success" />
          <h4 className="font-semibold text-ordino-text">Setup Scripts</h4>
        </div>
        <div className="space-y-2">
          {testDataStrategy.setupScripts.map((script, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-2 p-2 bg-ordino-card rounded-lg"
            >
              <FileCode size={14} className="text-ordino-success" />
              <span className="text-sm font-mono text-ordino-text">{script}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Teardown Scripts */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Trash2 size={20} className="text-ordino-error" />
          <h4 className="font-semibold text-ordino-text">Teardown Scripts</h4>
        </div>
        <div className="space-y-2">
          {testDataStrategy.teardownScripts.map((script, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.1 }}
              className="flex items-center gap-2 p-2 bg-ordino-card rounded-lg"
            >
              <Trash2 size={14} className="text-ordino-error" />
              <span className="text-sm font-mono text-ordino-text">{script}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dependencies */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="bg-ordino-bg rounded-xl border border-ordino-border p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Link size={20} className="text-ordino-primary" />
          <h4 className="font-semibold text-ordino-text">Data Dependencies</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {testDataStrategy.dependencies.map((dep, index) => (
            <Badge key={index} variant="primary" size="sm">
              {dep}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Summary Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="bg-gradient-to-r from-ordino-success/10 to-transparent rounded-xl border border-ordino-success/20 p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-ordino-success/20 flex items-center justify-center flex-shrink-0">
            <Database size={20} className="text-ordino-success" />
          </div>
          <div>
            <h4 className="font-semibold text-ordino-text mb-1">Strategy Complete</h4>
            <p className="text-sm text-ordino-text-muted">
              Comprehensive test data strategy defined with {testDataStrategy.requirements.length} data entities,
              {' '}{testDataStrategy.setupScripts.length} setup scripts, and full privacy compliance.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
