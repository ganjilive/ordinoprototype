import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User, Users, Code, CheckCircle } from 'lucide-react';
import { Badge } from '../../../common';

type Role = 'qa-lead' | 'manager' | 'developer';

interface DashboardView {
  role: Role;
  title: string;
  icon: typeof User;
  metrics: string[];
}

const dashboardViews: DashboardView[] = [
  {
    role: 'qa-lead',
    title: 'QA Lead Dashboard',
    icon: User,
    metrics: ['Test execution trends', 'Failure analysis', 'Test coverage gaps', 'Flaky test identification'],
  },
  {
    role: 'manager',
    title: 'Manager Dashboard',
    icon: Users,
    metrics: ['Overall quality score', 'Release readiness', 'Team productivity', 'Risk assessment'],
  },
  {
    role: 'developer',
    title: 'Developer Dashboard',
    icon: Code,
    metrics: ['My failed tests', 'Code coverage by module', 'Test execution time', 'Recent test changes'],
  },
];

export function IntelligentDashboards() {
  const [phase, setPhase] = useState(0);
  const [generatedDashboards, setGeneratedDashboards] = useState<DashboardView[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role>('qa-lead');
  const mountedRef = useRef(true);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

    // Phase 0: Show generating message
    if (phase === 0) {
      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(1);
      }, 1500);
    }

    // Phase 1: Generate dashboards one by one
    if (phase === 1) {
      dashboardViews.forEach((dashboard, index) => {
        transitionTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setGeneratedDashboards(prev => [...prev, dashboard]);
        }, index * 700);
      });

      transitionTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setPhase(2);
      }, dashboardViews.length * 700 + 500);
    }
  }, [phase]);

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'qa-lead':
        return 'primary';
      case 'manager':
        return 'secondary';
      case 'developer':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-ordino-primary/20 flex items-center justify-center"
          animate={phase < 2 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <LayoutDashboard size={28} className="text-ordino-primary" />
        </motion.div>
        <h3 className="text-lg font-semibold text-ordino-text mb-2">
          {phase === 0 && 'Generating Intelligent Dashboards...'}
          {phase === 1 && 'Creating Role-Based Views'}
          {phase === 2 && 'Dashboards Ready'}
        </h3>
        <p className="text-sm text-ordino-text-muted">
          {phase === 0 && 'Customizing dashboards based on user roles and preferences'}
          {phase === 1 && 'Generating personalized insights for QA Leads, Managers, and Developers'}
          {phase === 2 && `${generatedDashboards.length} role-specific dashboards created with tailored metrics`}
        </p>
      </div>

      {/* Dashboard Tabs */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 p-1 bg-ordino-card rounded-lg border border-ordino-border"
        >
          {generatedDashboards.map((dashboard) => (
            <button
              key={dashboard.role}
              onClick={() => setSelectedRole(dashboard.role)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors ${
                selectedRole === dashboard.role
                  ? 'bg-ordino-primary text-white'
                  : 'text-ordino-text-muted hover:text-ordino-text hover:bg-ordino-bg'
              }`}
            >
              <dashboard.icon size={16} />
              <span className="text-sm font-medium">{dashboard.role.replace('-', ' ').toUpperCase()}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Dashboard Views */}
      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-sm font-semibold text-ordino-text-muted uppercase tracking-wider">
            {phase === 1 ? 'Generating Dashboards' : 'Role-Based Dashboard Preview'}
          </h4>

          {phase === 1 ? (
            <div className="space-y-2">
              <AnimatePresence>
                {generatedDashboards.map((dashboard) => (
                  <motion.div
                    key={dashboard.role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-ordino-card rounded-lg border border-ordino-border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-ordino-primary/10 flex-shrink-0">
                          <dashboard.icon size={16} className="text-ordino-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-ordino-text">{dashboard.title}</span>
                            <Badge variant={getRoleBadgeVariant(dashboard.role)} size="sm">
                              {dashboard.role.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-xs text-ordino-text-muted">{dashboard.metrics.length} custom metrics</p>
                        </div>
                      </div>
                      <CheckCircle size={18} className="text-ordino-success" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {generatedDashboards.map((dashboard) =>
                dashboard.role === selectedRole ? (
                  <motion.div
                    key={dashboard.role}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-ordino-card rounded-lg border border-ordino-border p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-ordino-primary/10">
                        <dashboard.icon size={24} className="text-ordino-primary" />
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold text-ordino-text">{dashboard.title}</h5>
                        <p className="text-sm text-ordino-text-muted">Personalized metrics and insights</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-ordino-text-muted uppercase tracking-wider mb-3">Key Metrics</p>
                      <div className="grid grid-cols-2 gap-3">
                        {dashboard.metrics.map((metric) => (
                          <div key={metric} className="bg-ordino-bg/50 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-ordino-success" />
                              <span className="text-sm text-ordino-text">{metric}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          )}
        </motion.div>
      )}

      {/* Summary */}
      {phase === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-ordino-success/10 to-ordino-primary/5 rounded-xl border border-ordino-success/20 p-6"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ordino-success/20 text-ordino-success mb-3">
              <CheckCircle size={24} />
            </div>
            <h4 className="text-sm font-semibold text-ordino-text mb-1">Dashboards Generated</h4>
            <p className="text-xs text-ordino-text-muted mb-4">
              Each stakeholder receives a personalized view with relevant metrics and actionable insights
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-ordino-primary">{generatedDashboards.length}</p>
                <p className="text-xs text-ordino-text-muted mt-1">Role Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-ordino-secondary">12</p>
                <p className="text-xs text-ordino-text-muted mt-1">Unique Metrics</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-ordino-success">100%</p>
                <p className="text-xs text-ordino-text-muted mt-1">Personalized</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
