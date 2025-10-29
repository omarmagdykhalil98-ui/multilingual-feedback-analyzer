
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsCharts = ({ stats }) => {

  const sentimentData = Object.entries(stats?.sentiment_breakdown || {}).map(([name, value]) => ({ name, value }));
  const languageData = Object.entries(stats?.language_breakdown || {}).map(([name, value]) => ({ name, value }));

  const SENTIMENT_COLORS = {
    Positive: '#10B981',
    Negative: '#EF4444',
    Neutral: '#6B7280',
  };

  const LANGUAGE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-secondary mb-4">Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name]} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md lg:col-span-2">
            <h3 className="text-lg font-medium text-secondary mb-4">Language Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={languageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count">
                    {languageData.map((entry, index) => <Cell key={`cell-${index}`} fill={LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]} />)}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
  )
}

export default AnalyticsCharts;
