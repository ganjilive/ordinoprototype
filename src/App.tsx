import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';

// Lazy load pages for better initial load performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const WorkflowDemo = lazy(() => import('./pages/WorkflowDemo').then(m => ({ default: m.WorkflowDemo })));
const TestExecutionDemo = lazy(() => import('./pages/TestExecutionDemo').then(m => ({ default: m.TestExecutionDemo })));
const TestFailureDemo = lazy(() => import('./pages/TestFailureDemo').then(m => ({ default: m.TestFailureDemo })));
const RCADemo = lazy(() => import('./pages/RCADemo').then(m => ({ default: m.RCADemo })));
const AutoHealDemo = lazy(() => import('./pages/AutoHealDemo').then(m => ({ default: m.AutoHealDemo })));
const History = lazy(() => import('./pages/History').then(m => ({ default: m.History })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const SlackDemo = lazy(() => import('./pages/SlackDemo').then(m => ({ default: m.SlackDemo })));
const TeamsDemo = lazy(() => import('./pages/TeamsDemo').then(m => ({ default: m.TeamsDemo })));
const JiraDemo = lazy(() => import('./pages/JiraDemo').then(m => ({ default: m.JiraDemo })));
const VSCodeDemo = lazy(() => import('./pages/VSCodeDemo').then(m => ({ default: m.VSCodeDemo })));
const AutoHealingTests = lazy(() => import('./pages/AutoHealingTests').then(m => ({ default: m.AutoHealingTests })));
const TestDesign = lazy(() => import('./pages/TestDesign').then(m => ({ default: m.TestDesign })));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-ordino-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-ordino-text-muted">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/demo"
            element={
              <Suspense fallback={<PageLoader />}>
                <WorkflowDemo />
              </Suspense>
            }
          />
          <Route
            path="/execution"
            element={
              <Suspense fallback={<PageLoader />}>
                <TestExecutionDemo />
              </Suspense>
            }
          />
          <Route
            path="/failure"
            element={
              <Suspense fallback={<PageLoader />}>
                <TestFailureDemo />
              </Suspense>
            }
          />
          <Route
            path="/rca"
            element={
              <Suspense fallback={<PageLoader />}>
                <RCADemo />
              </Suspense>
            }
          />
          <Route
            path="/heal"
            element={
              <Suspense fallback={<PageLoader />}>
                <AutoHealDemo />
              </Suspense>
            }
          />
          <Route
            path="/history"
            element={
              <Suspense fallback={<PageLoader />}>
                <History />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/slack"
            element={
              <Suspense fallback={<PageLoader />}>
                <SlackDemo />
              </Suspense>
            }
          />
          <Route
            path="/teams"
            element={
              <Suspense fallback={<PageLoader />}>
                <TeamsDemo />
              </Suspense>
            }
          />
          <Route
            path="/jira"
            element={
              <Suspense fallback={<PageLoader />}>
                <JiraDemo />
              </Suspense>
            }
          />
          <Route
            path="/vscode"
            element={
              <Suspense fallback={<PageLoader />}>
                <VSCodeDemo />
              </Suspense>
            }
          />
          <Route
            path="/auto-healing-tests"
            element={
              <Suspense fallback={<PageLoader />}>
                <AutoHealingTests />
              </Suspense>
            }
          />
          <Route
            path="/test-design"
            element={
              <Suspense fallback={<PageLoader />}>
                <TestDesign />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
