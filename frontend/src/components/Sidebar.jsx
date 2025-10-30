
import { BarChart, MessageSquare, Settings } from 'lucide-react';

const Sidebar = ({ setView, view }) => {
  const getLinkClass = (tabName) => {
    return `flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-primary-dark ${
      view === tabName ? 'bg-primary-dark' : ''
    }`;
  };

  return (
    <div className="w-64 bg-secondary text-white p-5 flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">Feedback Analyzer</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4">
            <a
              href="#"
              className={getLinkClass('submit')}
              onClick={() => setView('submit')}
            >
              <MessageSquare />
              <span className="ml-3">Submit Feedback</span>
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#"
              className={getLinkClass('analytics')}
              onClick={() => setView('analytics')}
            >
              <BarChart />
              <span className="ml-3">Analytics</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className={getLinkClass('settings')}
              onClick={() => setView('settings')}
            >
              <Settings />
              <span className="ml-3">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="text-center text-xs text-gray-400">
        <p>© 2025 Powered by Gemini + FastAPI</p>
      </div>
    </div>
  );
};

export default Sidebar;
