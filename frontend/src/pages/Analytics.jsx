import React, { useState } from "react";
import Papa from 'papaparse';
import { Plus, Download, Smile, Frown, Meh } from "lucide-react";
import FeedbackTable from "../components/FeedbackTable";
import AnalyticsCharts from "../components/AnalyticsCharts";

const Analytics = ({ feedback, stats, setView }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const productData = Object.entries(stats?.product_breakdown || {}).map(
    ([name, value]) => ({ name, value })
  );

  const exportToCsv = () => {
    const csv = Papa.unparse(filteredFeedback); // Use filteredFeedback
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'feedback.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFeedback = feedback.filter((item) => {
    if (!item) return false; 
    const original = item.original_text?.toLowerCase() || "";
    const translated = item.translated_text?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return (
      (original.includes(search) || translated.includes(search)) &&
      (productFilter ? item.product_id === productFilter : true)
    );
  });

  return (
    <div className="min-h-screen bg-background p-8 dark:bg-dark-background transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-900">
          Analytics Dashboard
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setView("submit")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md shadow-soft hover:bg-primaryDark transition"
          >
            <Plus size={16} />
            Add Feedback
          </button>
          <button
            onClick={exportToCsv} // Call the new exportToCsv function
            className="flex items-center gap-2 px-4 py-2 border border-neutral rounded-md hover:bg-accent hover:text-gray-900 transition"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Feedback" value={stats?.total || 0} />
        <StatCard
          title="Positive"
          value={stats?.sentiment_breakdown?.Positive || 0}
          color="text-green-600"
          icon={<Smile className="text-green-500" />}
        />
        <StatCard
          title="Negative"
          value={stats?.sentiment_breakdown?.Negative || 0}
          color="text-red-600"
          icon={<Frown className="text-red-500" />}
        />
        <StatCard
          title="Neutral"
          value={stats?.sentiment_breakdown?.Neutral || 0}
          color="text-gray-600"
          icon={<Meh className="text-gray-500" />}
        />
      </div>

      {/* Charts */}
      <div className="bg-surface dark:bg-dark-surface p-6 rounded-xl shadow-soft hover:shadow-glow transition-shadow mb-8">
        <AnalyticsCharts stats={stats} />
      </div>

      {/* Filters + Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <input
            type="text"
            placeholder="Search feedback..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500"
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

        <FeedbackTable feedback={filteredFeedback} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color = "text-gray-800", icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
    <div>
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
    {icon && <div className="text-3xl">{icon}</div>}
  </div>
);

export default Analytics;
