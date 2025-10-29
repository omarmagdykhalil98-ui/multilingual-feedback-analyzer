
import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import { getFeedback, getStats } from './services/api';
import { Toaster } from 'react-hot-toast';

function App() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchFeedback = async () => {
    const response = await getFeedback();
    setFeedback(response.data);
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
  }, []);

  return (
    <>
      <Toaster />
      <Dashboard
        feedback={feedback}
        stats={stats}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </>
  );
}

export default App;
