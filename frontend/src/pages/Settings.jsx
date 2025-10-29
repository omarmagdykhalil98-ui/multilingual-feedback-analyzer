
import React, { useState, useEffect } from 'react';
import { getHealth, getModelName } from '../services/api';

const Settings = () => {
  const [health, setHealth] = useState(null);
  const [modelName, setModelName] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await getHealth();
        setHealth(response.data);
      } catch (error) {
        console.error('Error fetching health:', error);
      }
    };

    const fetchModelName = async () => {
      try {
        const response = await getModelName();
        setModelName(response.data.model_name);
      } catch (error) {
        console.error('Error fetching model name:', error);
      }
    };

    fetchHealth();
    fetchModelName();
  }, []);

  return (
    <div className="p-8 bg-background">
      <h2 className="text-2xl font-bold mb-6 text-secondary">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-secondary mb-4">Backend Health</h3>
          {health ? (
            <div>
              <p>Status: <span className="font-semibold text-success">{health.status}</span></p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-secondary mb-4">Gemini Model</h3>
          {modelName ? (
            <div>
              <p>Model Name: <span className="font-semibold">{modelName}</span></p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
