import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../common';

interface ProjectSettings {
  projectName: string;
  coverageThreshold: number;
  passRateThreshold: number;
  automationThreshold: number;
  autoApprove: boolean;
  notifyOnGaps: boolean;
}

const defaultSettings: ProjectSettings = {
  projectName: 'Ordino Demo Project',
  coverageThreshold: 80,
  passRateThreshold: 95,
  automationThreshold: 70,
  autoApprove: false,
  notifyOnGaps: true,
};

export function ProjectConfig() {
  const [settings, setSettings] = useState<ProjectSettings>(defaultSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Configuration</CardTitle>
        <Badge variant="info" size="sm">Demo Mode</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-ordino-text mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={settings.projectName}
              onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
              className="w-full px-3 py-2 bg-ordino-bg border border-ordino-border rounded-lg text-sm text-ordino-text focus:outline-none focus:border-ordino-primary transition-colors"
            />
          </div>

          {/* Thresholds */}
          <div>
            <h4 className="text-sm font-medium text-ordino-text mb-4">Quality Thresholds</h4>
            <div className="space-y-4">
              {/* Coverage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-ordino-text-muted">Coverage Threshold</label>
                  <span className="text-sm font-medium text-ordino-primary">{settings.coverageThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.coverageThreshold}
                  onChange={(e) => setSettings({ ...settings, coverageThreshold: Number(e.target.value) })}
                  className="w-full h-2 bg-ordino-border rounded-lg appearance-none cursor-pointer accent-ordino-primary"
                />
              </div>

              {/* Pass Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-ordino-text-muted">Pass Rate Threshold</label>
                  <span className="text-sm font-medium text-ordino-success">{settings.passRateThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.passRateThreshold}
                  onChange={(e) => setSettings({ ...settings, passRateThreshold: Number(e.target.value) })}
                  className="w-full h-2 bg-ordino-border rounded-lg appearance-none cursor-pointer accent-ordino-success"
                />
              </div>

              {/* Automation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-ordino-text-muted">Automation Threshold</label>
                  <span className="text-sm font-medium text-ordino-secondary">{settings.automationThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.automationThreshold}
                  onChange={(e) => setSettings({ ...settings, automationThreshold: Number(e.target.value) })}
                  className="w-full h-2 bg-ordino-border rounded-lg appearance-none cursor-pointer accent-ordino-secondary"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div>
            <h4 className="text-sm font-medium text-ordino-text mb-4">Automation Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-ordino-text-muted">Auto-approve generated test plans</span>
                <div
                  onClick={() => setSettings({ ...settings, autoApprove: !settings.autoApprove })}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    settings.autoApprove ? 'bg-ordino-primary' : 'bg-ordino-border'
                  } relative`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                    animate={{ left: settings.autoApprove ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-ordino-text-muted">Notify team when gaps are detected</span>
                <div
                  onClick={() => setSettings({ ...settings, notifyOnGaps: !settings.notifyOnGaps })}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    settings.notifyOnGaps ? 'bg-ordino-primary' : 'bg-ordino-border'
                  } relative`}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                    animate={{ left: settings.notifyOnGaps ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-ordino-border">
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {isSaved ? (
                <>Saved!</>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
