import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatSidebar } from '../chat/ChatSidebar';
import { pageVariants } from '../../utils/animations';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/demo': 'Test Scripting Demo',
  '/execution': 'Test Execution Demo',
  '/failure': 'Test Failure Demo',
  '/rca': 'RCA Demo',
  '/history': 'History',
  '/settings': 'Settings',
};

export function MainLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Ordino AI';

  return (
    <div className="min-h-screen bg-ordino-bg">
      {/* Sidebar */}
      <Sidebar onChatToggle={() => setIsChatOpen(!isChatOpen)} isChatOpen={isChatOpen} />

      {/* Main Content */}
      <div className="ml-64 min-h-screen flex flex-col">
        <Header title={pageTitle} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
