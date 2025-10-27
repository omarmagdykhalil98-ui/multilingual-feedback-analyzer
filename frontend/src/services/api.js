import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Assuming the backend is running on port 8000
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
