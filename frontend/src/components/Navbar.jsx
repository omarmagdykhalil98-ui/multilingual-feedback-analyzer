
import { Search, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const Navbar = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center dark:bg-dark-card">
      <h1 className="text-xl font-semibold text-secondary dark:text-dark-secondary">Multilingual Feedback Analyzer</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-background dark:text-dark-secondary"
          />
        </div>
        <button onClick={toggleTheme} className="text-secondary dark:text-dark-secondary">
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
