import { Search, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const Navbar = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <header className="sticky top-0 z-10 bg-surface dark:bg-dark-surface shadow-soft px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-primary dark:text-accent">Multilingual Feedback Analyzer</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral dark:text-dark-textSecondary" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-dark-surface dark:text-dark-textPrimary transition"
          />
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
