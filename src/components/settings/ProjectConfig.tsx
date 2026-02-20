import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Users, X, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal } from '../common';

interface ProjectSettings {
  projectName: string;
  team: string;
  coverageThreshold: number;
  passRateThreshold: number;
  automationThreshold: number;
  autoApprove: boolean;
  notifyOnGaps: boolean;
}

const defaultSettings: ProjectSettings = {
  projectName: 'Ordino Demo Project',
  team: 'User Onboarding Team',
  coverageThreshold: 80,
  passRateThreshold: 95,
  automationThreshold: 70,
  autoApprove: false,
  notifyOnGaps: true,
};

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'QA Lead' },
  { id: '2', name: 'Michael Rodriguez', email: 'michael.r@example.com', role: 'QA Engineer' },
  { id: '3', name: 'Emily Johnson', email: 'emily.j@example.com', role: 'QA Engineer' },
];

export function ProjectConfig() {
  const [settings, setSettings] = useState<ProjectSettings>(defaultSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
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

          {/* Team */}
          <div>
            <label className="block text-sm font-medium text-ordino-text mb-2">
              Team
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.team}
                onChange={(e) => setSettings({ ...settings, team: e.target.value })}
                className="flex-1 px-3 py-2 bg-ordino-bg border border-ordino-border rounded-lg text-sm text-ordino-text focus:outline-none focus:border-ordino-primary transition-colors"
              />
              <Button
                variant="secondary"
                onClick={() => setIsManageMembersOpen(true)}
                className="shrink-0"
              >
                <Users size={16} className="mr-1.5" />
                Manage Members
              </Button>
            </div>
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

      {/* Manage Members Modal */}
      <Modal
        isOpen={isManageMembersOpen}
        onClose={() => setIsManageMembersOpen(false)}
        title="Manage Team Members"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ordino-text-muted">
              {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''} in {settings.team}
            </p>
            <Button size="sm">
              <Plus size={16} className="mr-1.5" />
              Add Member
            </Button>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-ordino-bg border border-ordino-border hover:border-ordino-border/80 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ordino-text">{member.name}</p>
                  <p className="text-xs text-ordino-text-muted">{member.email}</p>
                  <p className="text-xs text-ordino-text-muted mt-0.5">{member.role}</p>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1.5 rounded text-ordino-text-muted hover:text-ordino-error hover:bg-ordino-error/10 transition-colors"
                  aria-label={`Remove ${member.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <p className="text-sm text-ordino-text-muted text-center py-4">
              No team members yet. Click "Add Member" to get started.
            </p>
          )}
        </div>
      </Modal>
    </Card>
  );
}
