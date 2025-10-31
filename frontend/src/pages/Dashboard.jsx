import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SubmitFeedback from './SubmitFeedback';
import Analytics from './Analytics';
import Settings from './Settings';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ feedback, stats, onFeedbackSubmitted }) => {
  const [view, setView] = useState('analytics'); // 'submit', 'analytics', or 'settings'

  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-100vw"
    },
    in: {
      opacity: 1,
      x: 0
    },
    out: {
      opacity: 0,
      x: "100vw"
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="flex h-screen bg-background dark:bg-dark-background">
      <Sidebar setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === 'submit' && (
              <motion.div
                key="submit"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <SubmitFeedback onFeedbackSubmitted={onFeedbackSubmitted} />
              </motion.div>
            )}
            {view === 'analytics' && (
              <motion.div
                key="analytics"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Analytics feedback={feedback} stats={stats} setView={setView} />
              </motion.div>
            )}
            {view === 'settings' && (
              <motion.div
                key="settings"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Settings />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;