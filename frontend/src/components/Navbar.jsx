import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

const Navbar = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <header className="bg-card shadow-md p-4 flex justify-between items-center dark:bg-dark-card transition-all duration-300">
      <h1 className="text-xl font-semibold text-secondary dark:text-white">
        Multilingual Feedback Analyzer
      </h1>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </header>
  );
};

export default Navbar;
