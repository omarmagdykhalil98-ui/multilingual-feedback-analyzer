import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import { getFeedback, getStats } from './services/api';
import { Toaster } from 'react-hot-toast';

function App() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchFeedback = async () => {
    let allFeedback = [];
    let page = 1;
    const limit = 100;
    while (true) {
      const response = await getFeedback({ page, limit });
      const data = response.data;
      allFeedback = [...allFeedback, ...data];
      if (data.length < limit) {
        break;
      }
      page++;
    }
    setFeedback(allFeedback);
  };

  const fetchStats = async () => {
    const response = await getStats();
    setStats(response.data);
  };

  const handleFeedbackSubmitted = () => {
    fetchFeedback();
    fetchStats();
  };

  useEffect(() => {
    fetchFeedback();
    fetchStats();

    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    // Trigger fade-in animation once mounted
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen bg-background dark:bg-dark-background text-textPrimary dark:text-dark-textPrimary 
                  transition-colors duration-300 ease-in-out ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                  } transform duration-700`}
    >
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <Dashboard
        feedback={feedback}
        stats={stats}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </div>
  );
}

export default App;
