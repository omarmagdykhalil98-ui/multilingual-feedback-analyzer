import { BarChart, MessageSquare, Settings } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ setView }) => {
  const [activeTab, setActiveTab] = useState('submit');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setView(tab);
  };

  const menuItems = [
    { id: 'submit', label: 'Submit Feedback', icon: <MessageSquare size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className="w-64 min-h-screen bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100
                 flex flex-col justify-between border-r border-gray-200 dark:border-gray-700
                 transition-colors duration-300 shadow-md"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold tracking-tight">Feedback Analyzer</h1>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
              ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        © 2025 Powered by Gemini + FastAPI
      </div>
    </aside>
  );
};

export default Sidebar;
