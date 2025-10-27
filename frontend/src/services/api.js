import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getFeedback = (params) => {
  return apiClient.get('/feedback', { params });
};

export const createFeedback = (data) => {
  return apiClient.post('/feedback', data);
};

export const getStats = () => {
  return apiClient.get('/stats');
};

export const translateText = (data) => {
  return apiClient.post('/translate', data);
};