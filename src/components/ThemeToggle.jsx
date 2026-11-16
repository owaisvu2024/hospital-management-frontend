import React, { useEffect, useState } from 'react';

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Page load hone par check karo ke pehle se konsa theme saved hai
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      // Light mode enable kar rahe hain
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      // Dark mode enable kar rahe hain
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 px-3 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2 text-sm shadow-sm"
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

export default ThemeToggle;