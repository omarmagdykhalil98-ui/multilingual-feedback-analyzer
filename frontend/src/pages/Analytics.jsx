import React, { useState } from 'react';
import { Plus, Download, Smile, Frown, Meh } from 'lucide-react';
import FeedbackTable from '../components/FeedbackTable';
import AnalyticsCharts from '../components/AnalyticsCharts';

const Analytics = ({ feedback, stats, setView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('');

  // Ensure stats exist before mapping
  const productData = Object.entries(stats?.product_breakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  // ✅ Safe filtering with null checks
  const filteredFeedback = feedback.filter((item) => {
    const originalText = item.original_text?.toLowerCase() || '';
    const translatedText = item.translated_text?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return (
      (originalText.includes(search) || translatedText.includes(search)) &&
      (productFilter ? item.product_id === productFilter : true)
    );
  });

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-secondary">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => setView('submit')}
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Feedback
          </button>

          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-secondary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Download className="-ml-1 mr-2 h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-secondary">Total Feedback</h3>
            <p className="text-3xl font-bold text-secondary">{stats?.total || 0}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-secondary">Positive</h3>
            <p className="text-3xl font-bold text-success">{stats?.sentiment_breakdown?.Positive || 0}</p>
          </div>
          <Smile className="h-12 w-12 text-success" />
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-secondary">Negative</h3>
            <p className="text-3xl font-bold text-error">{stats?.sentiment_breakdown?.Negative || 0}</p>
          </div>
          <Frown className="h-12 w-12 text-error" />
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-secondary">Neutral</h3>
            <p className="text-3xl font-bold text-neutral">{stats?.sentiment_breakdown?.Neutral || 0}</p>
          </div>
          <Meh className="h-12 w-12 text-neutral" />
        </div>
      </div>

      {/* --- Charts Section --- */}
      <AnalyticsCharts stats={stats} />

      {/* --- Filter Section --- */}
      <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-medium text-secondary">All Feedback</h3>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search feedback..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="">All Products</option>
            {productData.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Feedback Table --- */}
      <FeedbackTable feedback={filteredFeedback} />
    </div>
  );
};

export default Analytics;
