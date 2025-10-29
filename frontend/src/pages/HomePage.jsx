import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Box } from '@mui/material';
import Header from '../components/Header';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';
import StatsCard from '../components/StatsCard';
import { getFeedback, getStats } from '../services/api';

const HomePage = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchFeedback = useCallback(async () => {
    try {
      const response = await getFeedback(filters);
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [fetchFeedback]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFeedbackSubmitted = () => {
    fetchFeedback();
    fetchStats();
  };

  return (
    <div>
      <Header filters={filters} onFilterChange={handleFilterChange} />
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
            </Box>
            <FeedbackList feedback={feedback} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard stats={stats} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
