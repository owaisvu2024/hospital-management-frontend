import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import hospitalLogo from '../assets/hospital-logo.png';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Component mount hone par current theme state check karna
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 text-gray-800 dark:text-white sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand Name */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <img 
              src={hospitalLogo} 
              alt="MedCore Logo" 
              className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-200 dark:border-slate-700" 
            />
            <span className="text-lg sm:text-xl font-bold tracking-wide">
              MedCore Hospital
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Patients', path: '/patients' },
              { name: 'Doctors', path: '/doctors' },
              { name: 'Appointments', path: '/appointments' },
              { name: 'Departments', path: '/departments' },
              { name: 'Insurance', path: '/insurances' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions: Theme Toggle & Logout (Same Size & Alignment) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-1.5 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-yellow-400 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition border border-gray-300 dark:border-slate-700 shadow-sm whitespace-nowrap"
              title="Toggle Theme"
            >
              <span>{isDarkMode ? '☀️' : '🌙'}</span>
              <span>{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition shadow-md whitespace-nowrap"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;